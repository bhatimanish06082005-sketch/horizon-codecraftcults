const express = require('express');
const router = express.Router();
const { protect, ownerOnly } = require('../middleware/auth');
const { getSales, getOrders } = require('../controllers/salesController');
const { getInventory } = require('../controllers/inventoryController');
const { getTickets } = require('../controllers/ticketsController');
const { getAlerts, acknowledgeAlert } = require('../controllers/alertsController');
const { getStressScore } = require('../controllers/stressController');
const { getHistory } = require('../controllers/historyController');
const { getIntegrations, saveIntegration, getLiveData } = require('../controllers/integrationController');

router.get('/sales', protect, getSales);
router.get('/orders', protect, getOrders);
router.get('/inventory', protect, getInventory);
router.get('/tickets', protect, getTickets);
router.get('/alerts', protect, getAlerts);
router.patch('/alerts/:id/acknowledge', protect, acknowledgeAlert);
router.get('/stress-score', protect, getStressScore);
router.get('/history', protect, ownerOnly, getHistory);
router.get('/integrations', protect, getIntegrations);
router.post('/integrations', protect, saveIntegration);
router.get('/integrations/live', protect, getLiveData);

module.exports = router;