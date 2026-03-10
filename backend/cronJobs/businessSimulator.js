const cron = require('node-cron');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Ticket = require('../models/Ticket');
const Alert = require('../models/Alert');
const History = require('../models/History');

const products = [
  'Wireless Headphones', 'Mechanical Keyboard', 'USB-C Hub', 'Laptop Stand',
  'Webcam HD', 'Desk Organizer', 'Ergonomic Chair', 'Monitor Arm'
];
const customers = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee', 'Emma Davis', 'Frank Miller'];
const ticketSubjects = [
  'Order not received', 'Wrong item delivered', 'Billing issue',
  'Product defective', 'Return request', 'Refund inquiry'
];
const productPrices = { 'Wireless Headphones': 89.99, 'Mechanical Keyboard': 129.99, 'USB-C Hub': 49.99, 'Laptop Stand': 39.99, 'Webcam HD': 79.99, 'Desk Organizer': 24.99, 'Ergonomic Chair': 299.99, 'Monitor Arm': 59.99 };

let ioRef = null;

const setIO = (io) => { ioRef = io; };

const emitEvent = (eventType, data) => {
  if (ioRef) {
    ioRef.emit('business_event', { type: eventType, data, timestamp: new Date() });
  }
};

// Simulate new order every 8-15 seconds
const simulateOrder = async () => {
  try {
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = productPrices[product] || 49.99;
    const customer = customers[Math.floor(Math.random() * customers.length)];

    const order = new Order({
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      product,
      quantity: qty,
      amount: parseFloat((price * qty).toFixed(2)),
      status: Math.random() > 0.1 ? 'completed' : 'processing',
      customer
    });
    await order.save();

    // Reduce inventory
    await Inventory.findOneAndUpdate(
      { name: product },
      { $inc: { stock: -qty }, updatedAt: new Date() }
    );

    emitEvent('new_order', {
      orderId: order.orderId,
      product,
      amount: order.amount,
      customer,
      status: order.status
    });

    // Check if order creates a spike
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Order.countDocuments({ createdAt: { $gte: today } });
    if (todayCount > 0 && todayCount % 20 === 0) {
      const alert = new Alert({
        type: 'opportunity',
        title: 'Sales Spike Detected',
        message: `${todayCount} orders placed today — higher than average. Consider increasing inventory.`,
        severity: 'medium',
        vertical: 'sales'
      });
      await alert.save();
      emitEvent('alert', { alert });
    }

    // Check critical inventory
    const item = await Inventory.findOne({ name: product });
    if (item && item.stock <= item.minStock) {
      const existingAlert = await Alert.findOne({
        title: { $regex: item.name },
        type: 'crisis',
        createdAt: { $gte: new Date(Date.now() - 3600000) }
      });
      if (!existingAlert) {
        const invAlert = new Alert({
          type: 'crisis',
          title: `Critical Stock: ${item.name}`,
          message: `${item.name} has only ${item.stock} units remaining (min: ${item.minStock}). Reorder immediately.`,
          severity: 'critical',
          vertical: 'inventory'
        });
        await invAlert.save();
        emitEvent('alert', { alert: invAlert });
        emitEvent('inventory_critical', { product: item.name, stock: item.stock });
      }
    }

    emitEvent('inventory_update', { product, newStock: item?.stock ?? 0 });
  } catch (err) {
    console.error('Simulate order error:', err.message);
  }
};

// Simulate ticket every 20-40 seconds
const simulateTicket = async () => {
  try {
    const priorities = ['low', 'medium', 'medium', 'high', 'critical'];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const subject = ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)];

    const ticket = new Ticket({
      ticketId: `TKT-${Date.now()}`,
      subject,
      customer,
      priority,
      status: 'open',
      category: ['billing', 'technical', 'general', 'complaint'][Math.floor(Math.random() * 4)]
    });
    await ticket.save();

    emitEvent('new_ticket', {
      ticketId: ticket.ticketId,
      subject,
      customer,
      priority
    });

    // Check for anomaly — many critical tickets
    const critCount = await Ticket.countDocuments({
      priority: 'critical',
      status: { $ne: 'closed' },
      createdAt: { $gte: new Date(Date.now() - 3600000) }
    });
    if (critCount >= 3) {
      const existingAnomaly = await Alert.findOne({
        type: 'anomaly',
        vertical: 'support',
        createdAt: { $gte: new Date(Date.now() - 1800000) }
      });
      if (!existingAnomaly) {
        const anomalyAlert = new Alert({
          type: 'anomaly',
          title: 'Unusual Support Ticket Surge',
          message: `${critCount} critical tickets in the last hour. Investigate potential service issue.`,
          severity: 'high',
          vertical: 'support'
        });
        await anomalyAlert.save();
        emitEvent('alert', { alert: anomalyAlert });
      }
    }
  } catch (err) {
    console.error('Simulate ticket error:', err.message);
  }
};

// Save history snapshot every 30 minutes
const saveHistorySnapshot = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({ createdAt: { $gte: today } });
    const revenue = todayOrders.reduce((s, o) => s + o.amount, 0);
    const allItems = await Inventory.find();
    const criticalItems = allItems.filter(i => i.stock <= i.minStock);
    const inventoryHealth = allItems.length > 0 ? (1 - criticalItems.length / allItems.length) * 100 : 100;
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'critical', status: { $ne: 'closed' } });
    const ticketLoad = Math.min(100, openTickets * 2 + criticalTickets * 5);
    const inventoryRisk = 100 - inventoryHealth;
    const salesDrop = Math.max(0, 100 - todayOrders.length * 5);
    const stressScore = Math.min(100, Math.round(0.4 * ticketLoad + 0.3 * inventoryRisk + 0.3 * salesDrop));

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:00`;

    await History.create({ revenue, orders: todayOrders.length, inventoryHealth, openTickets, stressScore, period });
    console.log(`📊 History snapshot saved: ${period}`);
  } catch (err) {
    console.error('History snapshot error:', err.message);
  }
};

const startCronJobs = (io) => {
  setIO(io);

  // Simulate order every 8 seconds
  setInterval(simulateOrder, 8000);

  // Simulate ticket every 25 seconds
  setInterval(simulateTicket, 25000);

  // Save history snapshot every 30 minutes
  cron.schedule('*/30 * * * *', saveHistorySnapshot);

  // Save initial snapshot after 5 seconds
  setTimeout(saveHistorySnapshot, 5000);

  console.log('⏰ Cron jobs and simulators started');
};

module.exports = { startCronJobs };
