const service = require("../services/purchaseService");

async function createPurchase(req, res) {
  try {
    const {
      supplier_id,
      items,
      total
    } = req.body;

    if (!supplier_id || !items || !total) {
      return res.status(400).json({
        success: false,
        error: "supplier_id, items and total are required"
      });
    }

    const result = await service.createPurchase(
      supplier_id,
      items,
      total
    );

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

async function listPurchases(req, res) {
  try {
    const data = await service.getAllPurchases();

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

async function getPurchase(req, res) {
  try {
    const data = await service.getPurchaseById(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Purchase not found",
      });
    }

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

async function getPurchaseItems(req, res) {
  try {
    const data = await service.getPurchaseItems(
      req.params.id
    );

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

async function updatePurchase(req, res) {
  try {
    const result = await service.updatePurchase(
      Number(req.params.id),
      req.body
    );

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

async function deletePurchase(req, res) {
  try {
    await service.deletePurchase(req.params.id);

    res.json({
      success: true,
      message: "Purchase deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}




module.exports = {
  createPurchase,
  listPurchases,
  getPurchase,
  getPurchaseItems,
  deletePurchase,
  updatePurchase,
};