const Order = require('../models/Order');

exports.getSales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await Order.find({ createdAt: { $gte: today } });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenueByDay = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      { $limit: 30 }
    ]);

    res.json({
      ordersToday: ordersToday.length,
      revenueToday: ordersToday.reduce((sum, o) => sum + o.amount, 0),
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders: ordersToday.slice(0, 10),
      revenueByDay
    });
  } catch (error) {
    console.error('Sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
