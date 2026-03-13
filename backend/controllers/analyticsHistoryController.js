const AnalyticsHistory = require('../models/AnalyticsHistory');

exports.getHistory = async (req, res) => {
  try {
    const { mode, range, integration } = req.query;
    let filter = {};
    if (mode && mode !== 'all') filter.mode = mode;
    if (integration && integration !== 'all') filter.integration = integration;
    if (range) {
      const now = new Date();
      if (range === 'today') filter.timestamp = { $gte: new Date(now.setHours(0,0,0,0)) };
      else if (range === '24h') filter.timestamp = { $gte: new Date(Date.now() - 24*60*60*1000) };
      else if (range === '7d') filter.timestamp = { $gte: new Date(Date.now() - 7*24*60*60*1000) };
    }
    const records = await AnalyticsHistory.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    await AnalyticsHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSnapshot = async (req, res) => {
  try {
    const { integration, stressScore, mode, kpis, alerts, alertSeverity, kpiVolatility, externalSignalRisk, anomalyFrequency } = req.body;
    const record = new AnalyticsHistory({ integration, stressScore, mode, kpis, alerts, alertSeverity, kpiVolatility, externalSignalRisk, anomalyFrequency });
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.autoSaveSnapshot = async (data) => {
  try {
    const record = new AnalyticsHistory(data);
    await record.save();
    console.log('📊 Analytics snapshot saved:', new Date().toLocaleString());
  } catch (err) {
    console.error('Auto-save error:', err);
  }
};