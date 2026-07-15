const service = require("../services/inventoryService");

// Add item
async function createItem(req, res) {
  try {
    const {
  item_name,
  category,
  brand,
  size,
  color,
  purchase_price,
  selling_price,
  stock,
  min_stock,
  barcode = null
} = req.body;

    if (!item_name) {
      return res.status(400).json({
        error: "Item name required"
      });
    }

    const result = await service.addItem({
      item_name,
      category,
      brand,
      size,
      color,
      purchase_price,
      selling_price,
      stock,
      min_stock,
      barcode
    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// Get all items
async function listItems(req, res) {

  try {

    const search = req.query.search || "";

    const data =
      await service.getAllItems(search);

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}

// Update stock
async function changeStock(req, res) {
  try {

    const { id, stock } = req.body;

    const result = await service.updateStock(id, stock);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}


async function updateItem(req, res) {
  try {
    const { id } = req.params;

    const {
      item_name,
      category,
      brand,
      size,
      color,
      purchase_price,
      selling_price,
      stock,
      min_stock,
      barcode
    } = req.body;

    const result = await service.updateItem(id, {
      item_name,
      category,
      brand,
      size,
      color,
      purchase_price,
      selling_price,
      stock,
      min_stock,
      barcode
    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}


async function deleteItem(req, res) {
  try {
    const { id } = req.params;

    const result = await service.deleteItem(id);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

async function updateStock(req, res) {
  try {
    const { id, stock } = req.body;

    const result = await service.updateInventoryStatus(id, stock);

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = {
  createItem,
  listItems,
  changeStock,
  updateItem,
  updateStock,
  deleteItem
};