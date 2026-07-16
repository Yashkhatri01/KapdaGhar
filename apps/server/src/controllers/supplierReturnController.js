const supplierReturnService = require("../services/supplierReturnService");

/**
 * Create Supplier Return
 */
async function createSupplierReturn(req, res) {

  try {

    const result =
      await supplierReturnService.createSupplierReturn(req.body);

    return res.status(201).json({
      success: true,
      message: "Supplier return created successfully.",
      data: result
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message
    });

  }

}

/**
 * Supplier Returns History
 */
async function getSupplierReturns(req, res) {

  try {

    const data =
      await supplierReturnService.getSupplierReturns();

    return res.json({
      success: true,
      data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

/**
 * View Single Supplier Return
 */
async function getSupplierReturn(req, res) {

  try {

    const data =
      await supplierReturnService.getSupplierReturnById(
        req.params.id
      );

    return res.json({
      success: true,
      data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

module.exports = {
  createSupplierReturn,
  getSupplierReturns,
  getSupplierReturn,
};