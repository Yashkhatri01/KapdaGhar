const customerReturnService = require("../services/customerReturnService");




async function getCustomerReturns(req, res) {

  try {

    const returns =
      await customerReturnService.getCustomerReturns();

      console.log("RETURNS =>", returns);

    res.json({
      success: true,
      data: returns,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

}

async function getCustomerReturn(req, res) {

  try {

    const data =
      await customerReturnService.getCustomerReturnById(
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

/**
 * Create Customer Return
 */
async function createCustomerReturn(req, res) {
  try {
    const result = await customerReturnService.createCustomerReturn(req.body);
    return res.status(201).json({
      success: true,
      message: "Customer return created successfully",
      data: result,
    });

  } catch (err) {

    console.error("CUSTOMER RETURN ERROR:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}



module.exports = {
  createCustomerReturn,
  getCustomerReturns,
  getCustomerReturn,
};