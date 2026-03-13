const express = require('express');
const router = express.Router();
const { protect, ownerOnly } = require('../middleware/auth');

// Safe controller loader — won't crash if a controller doesn't exist yet
const safeRequire = (path, fallback = {}) => {
  try { return require(path); } catch { return fallback; }
};

const { getSales, getOrders } = safeRequire('../controllers/salesController');
const { getInventory } = safeRequire('../controllers/inventoryController');
const { getTickets } = safeRequire('../controllers/ticketsController');
const { getAlerts, acknowledgeAlert } = safeRequire('../controllers/alertsController');
const { getStressScore } = safeRequire('../controllers/stressController');
const { getHistory } = safeRequire('../controllers/historyController');
const { getIntegrations, saveIntegration, getLiveData } = safeRequire('../controllers/integrationController');
const {
  getHistory: getAnalyticsHistory,
  deleteRecord,
  saveSnapshot
} = safeRequire('../controllers/analyticsHistoryController');

const stub = (name) => (req, res) => res.status(501).json({ message: `${name} controller not implemented` });

// Existing routes
if (getSales)       router.get('/sales', protect, getSales);
if (getOrders)      router.get('/orders', protect, getOrders);
if (getInventory)   router.get('/inventory', protect, getInventory);
if (getTickets)     router.get('/tickets', protect, getTickets);
if (getAlerts)      router.get('/alerts', protect, getAlerts);
if (acknowledgeAlert) router.patch('/alerts/:id/acknowledge', protect, acknowledgeAlert);
if (getStressScore) router.get('/stress-score', protect, getStressScore);
if (getHistory)     router.get('/history', protect, ownerOnly, getHistory);
if (getIntegrations) router.get('/integrations', protect, getIntegrations);
if (saveIntegration) router.post('/integrations', protect, saveIntegration);
if (getLiveData)    router.get('/integrations/live', protect, getLiveData);

// Analytics History routes — always register these
router.get('/analytics-history', protect, getAnalyticsHistory || stub('getAnalyticsHistory'));
router.post('/analytics-history', protect, saveSnapshot || stub('saveSnapshot'));
router.delete('/analytics-history/:id', protect, ownerOnly, deleteRecord || stub('deleteRecord'));

module.exports = router;