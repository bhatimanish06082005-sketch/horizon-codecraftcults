const Ticket = require('../models/Ticket');

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(50);
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'critical', status: { $ne: 'closed' } });

    res.json({
      tickets,
      openTickets,
      criticalTickets,
      totalTickets: await Ticket.countDocuments()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
