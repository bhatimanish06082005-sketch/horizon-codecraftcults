const History = require('../models/History');

exports.getHistory = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const history = await History.find({ timestamp: { $gte: since } }).sort({ timestamp: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
