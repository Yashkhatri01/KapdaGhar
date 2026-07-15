const service = require("../services/saleService");

async function createSale(req, res) {
  try {
    const {
      customer_id,
      items,
      subtotal,
      discount,
      tax,
      grand_total,
      payment_method,
      payment_status
    } = req.body;
    

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Sale must contain at least one item."
      });
    }

    const result = await service.createSale({
      customer_id,
      items,
      subtotal,
      discount,
      tax,
      grand_total,
      payment_method,
      payment_status
    });

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

async function listSales(req, res) {
  try {
    const data = await service.getAllSales();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSaleItems(req, res) {
  try {
    const data = await service.getSaleItems(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
  console.error("GET SALE ERROR:", err);

  res.status(500).json({
    success: false,
    error: err.message,
  });
}
}

async function getSale(req, res) {

  try {

    const data = await service.getSaleById(
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



async function getSaleById(req, res) {
  try {

    const data =
      await service.getSaleById(
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

async function updateSale(req, res) {

  try {

    const result = await service.updateSale(
      req.params.id,
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

async function deleteSale(req, res) {
  try {

    const result = await service.deleteSale(
      req.params.id
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



module.exports = {
  createSale,
  listSales,
  getSale,
  getSaleItems,
  updateSale,
  deleteSale,
};