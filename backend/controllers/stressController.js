const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Ticket = require('../models/Ticket');

exports.getStressScore = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Support ticket load (0-100): ratio of open/critical tickets
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'critical', status: { $ne: 'closed' } });
    const ticketLoad = Math.min(100, (openTickets * 2 + criticalTickets * 5));

    // Inventory risk (0-100): ratio of low-stock items
    const allItems = await Inventory.find();
    const criticalItems = allItems.filter(i => i.stock <= i.minStock);
    const inventoryRisk = allItems.length > 0 ? (criticalItems.length / allItems.length) * 100 : 0;

    // Sales performance drop (0-100)
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const salesDrop = Math.max(0, 100 - todayOrders * 5);

    const stressScore = Math.min(100, Math.round(
      0.4 * ticketLoad + 0.3 * inventoryRisk + 0.3 * salesDrop
    ));

    const status = stressScore < 30 ? 'healthy' : stressScore < 60 ? 'warning' : 'critical';

    res.json({
      stressScore,
      status,
      breakdown: {
        ticketLoad: Math.round(ticketLoad),
        inventoryRisk: Math.round(inventoryRisk),
        salesDrop: Math.round(salesDrop)
      }
    });
  } catch (error) {
    console.error('Stress score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
