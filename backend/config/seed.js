const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
require('dotenv').config();

const products = [
  { productId: 'P001', name: 'Wireless Headphones', category: 'Electronics', stock: 45, minStock: 10, price: 89.99 },
  { productId: 'P002', name: 'Mechanical Keyboard', category: 'Electronics', stock: 8, minStock: 15, price: 129.99 },
  { productId: 'P003', name: 'USB-C Hub', category: 'Electronics', stock: 62, minStock: 20, price: 49.99 },
  { productId: 'P004', name: 'Laptop Stand', category: 'Accessories', stock: 5, minStock: 10, price: 39.99 },
  { productId: 'P005', name: 'Webcam HD', category: 'Electronics', stock: 30, minStock: 8, price: 79.99 },
  { productId: 'P006', name: 'Desk Organizer', category: 'Office', stock: 100, minStock: 25, price: 24.99 },
  { productId: 'P007', name: 'Ergonomic Chair', category: 'Furniture', stock: 3, minStock: 5, price: 299.99 },
  { productId: 'P008', name: 'Monitor Arm', category: 'Accessories', stock: 20, minStock: 8, price: 59.99 },
];

const customers = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee', 'Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Brown'];

const ticketSubjects = [
  'Order not received', 'Wrong item delivered', 'Billing issue', 'Product defective',
  'Return request', 'Tracking not updating', 'Account access problem', 'Refund inquiry'
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany({});
  await Inventory.deleteMany({});
  await Order.deleteMany({});
  await Ticket.deleteMany({});

  // Create users
  const owner = new User({ name: 'Alex Rivera', email: 'owner@opspulse.com', password: 'password123', role: 'owner' });
  const ops = new User({ name: 'Jordan Chen', email: 'ops@opspulse.com', password: 'password123', role: 'ops_manager' });
  await owner.save();
  await ops.save();
  console.log('✅ Users created');

  // Create inventory
  await Inventory.insertMany(products);
  console.log('✅ Inventory created');

  // Create orders for last 14 days
  const orders = [];
  for (let d = 13; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const numOrders = Math.floor(Math.random() * 12) + 3;
    for (let i = 0; i < numOrders; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      orders.push({
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        product: product.name,
        quantity: qty,
        amount: parseFloat((product.price * qty).toFixed(2)),
        status: Math.random() > 0.2 ? 'completed' : 'processing',
        customer: customers[Math.floor(Math.random() * customers.length)],
        createdAt: date
      });
    }
  }
  await Order.insertMany(orders);
  console.log('✅ Orders created');

  // Create tickets
  const tickets = [];
  for (let i = 0; i < 20; i++) {
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 72));
    const priorities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['open', 'open', 'open', 'in_progress', 'resolved'];
    tickets.push({
      ticketId: `TKT-${1000 + i}`,
      subject: ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)],
      customer: customers[Math.floor(Math.random() * customers.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: ['billing', 'technical', 'general', 'complaint'][Math.floor(Math.random() * 4)],
      createdAt
    });
  }
  await Ticket.insertMany(tickets);
  console.log('✅ Tickets created');

  console.log('\n🚀 Database seeded successfully!');
  console.log('Demo accounts:');
  console.log('  Owner: owner@opspulse.com / password123');
  console.log('  Ops Manager: ops@opspulse.com / password123');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
