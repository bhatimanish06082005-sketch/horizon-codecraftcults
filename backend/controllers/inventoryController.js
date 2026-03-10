const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ stock: 1 });
    const criticalItems = items.filter(i => i.stock <= i.minStock);
    const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);

    res.json({
      items,
      criticalItems,
      totalItems: items.length,
      totalValue,
      healthScore: Math.max(0, 100 - (criticalItems.length / items.length) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
