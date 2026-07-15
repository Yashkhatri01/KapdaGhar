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
 * Get All Supplier Returns
 */
async function getAllSupplierReturns(req, res) {

  try {

    const data =
      await supplierReturnService.getAllSupplierReturns();

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
  getAllSupplierReturns
};