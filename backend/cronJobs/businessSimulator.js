const AnalyticsHistory = require('../models/AnalyticsHistory');

const INTEGRATIONS = ['news', 'weather', 'stocks', null];

/**
 * Simulates a realistic stress score without requiring an active user session.
 * Rotates through integration types to produce varied history records.
 */
const calcSimulatedStress = () => {
  // Weighted random mode: mostly normal, occasional crisis or opportunity
  const modeRoll = Math.random();
  const mode =
    modeRoll < 0.65 ? 'normal' :
    modeRoll < 0.85 ? 'crisis' :
    'opportunity';

  let alertSeverity, kpiVolatility, externalSignalRisk, anomalyFrequency;

  if (mode === 'crisis') {
    alertSeverity      = 78 + Math.random() * 18;
    kpiVolatility      = 68 + Math.random() * 22;
    externalSignalRisk = 72 + Math.random() * 22;
    anomalyFrequency   = 62 + Math.random() * 28;
  } else if (mode === 'opportunity') {
    alertSeverity      = 3  + Math.random() * 10;
    kpiVolatility      = 8  + Math.random() * 14;
    externalSignalRisk = 5  + Math.random() * 12;
    anomalyFrequency   = 3  + Math.random() * 10;
  } else {
    // Normal — spread across a realistic moderate range
    alertSeverity      = 12 + Math.random() * 28;
    kpiVolatility      = 18 + Math.random() * 28;
    externalSignalRisk = 15 + Math.random() * 25;
    anomalyFrequency   = 10 + Math.random() * 20;
  }

  const score = Math.round(
    0.40 * alertSeverity +
    0.30 * kpiVolatility +
    0.20 * externalSignalRisk +
    0.10 * anomalyFrequency
  );

  // Rotate integration type for variety in History Center
  const integration = INTEGRATIONS[Math.floor(Math.random() * INTEGRATIONS.length)];

  // Generate mock alerts for crisis snapshots
  const alerts = [];
  if (mode === 'crisis') {
    alerts.push(
      { type: 'crisis', message: 'CRISIS ALERT: Critical stress threshold exceeded', color: 'danger' },
      { type: 'crisis', message: `High ${integration || 'signal'} volatility detected`, color: 'danger' },
    );
    if (score >= 85) {
      alerts.push({ type: 'crisis', message: 'Anomaly frequency in critical range', color: 'danger' });
    }
  }

  return {
    mode,
    integration,
    stressScore: Math.min(100, Math.max(0, score)),
    alertSeverity:      Math.round(alertSeverity),
    kpiVolatility:      Math.round(kpiVolatility),
    externalSignalRisk: Math.round(externalSignalRisk),
    anomalyFrequency:   Math.round(anomalyFrequency),
    alerts,
  };
};

const saveAutoSnapshot = async () => {
  try {
    const data = calcSimulatedStress();
    const record = new AnalyticsHistory({
      integration:        data.integration,
      stressScore:        data.stressScore,
      mode:               data.mode,
      kpis:               {},
      alerts:             data.alerts,
      alertSeverity:      data.alertSeverity,
      kpiVolatility:      data.kpiVolatility,
      externalSignalRisk: data.externalSignalRisk,
      anomalyFrequency:   data.anomalyFrequency,
    });
    await record.save();
    console.log(
      `📊 Auto-snapshot saved: score=${data.stressScore} mode=${data.mode} ` +
      `integration=${data.integration || 'none'} @ ${new Date().toLocaleString()}`
    );
  } catch (err) {
    console.error('❌ Auto-snapshot error:', err.message);
  }
};

const startAutoSave = () => {
  console.log('⏱️  Analytics auto-save started — saving every 20 minutes');
  saveAutoSnapshot(); // save immediately on server boot
  setInterval(saveAutoSnapshot, 20 * 60 * 1000); // then every 20 min
};

// Backward-compatible alias for any code that imports startCronJobs
const startCronJobs = (_io) => startAutoSave();

module.exports = { startAutoSave, startCronJobs };