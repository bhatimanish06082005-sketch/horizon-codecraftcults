const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ acknowledged: false }).sort({ createdAt: -1 }).limit(20);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acknowledgeAlert = async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { acknowledged: true });
    res.json({ message: 'Alert acknowledged' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
