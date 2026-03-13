const mongoose = require('mongoose');

const analyticsHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  integration: { type: String, default: null },
  stressScore: { type: Number, default: 0 },
  mode: { type: String, default: 'normal' },
  kpis: { type: Object, default: {} },
  alerts: { type: Array, default: [] },
  alertSeverity: { type: Number, default: 0 },
  kpiVolatility: { type: Number, default: 0 },
  externalSignalRisk: { type: Number, default: 0 },
  anomalyFrequency: { type: Number, default: 0 },
});

module.exports = mongoose.model('AnalyticsHistory', analyticsHistorySchema);