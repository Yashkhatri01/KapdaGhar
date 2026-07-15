const service = require("../services/selfConsumptionService");

// Create Self Consumption
async function createSelfConsumption(req, res) {

  try {

    const data =
      await service.createSelfConsumption(
        req.body
      );

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

// List Self Consumptions
async function listSelfConsumptions(req, res) {

  try {

    const data =
      await service.getAllSelfConsumptions();

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

async function getSelfConsumptionItems(req, res) {

  try {

    const data =
      await service.getSelfConsumptionItems(
        req.params.id
      );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}


module.exports = {
  createSelfConsumption,
  listSelfConsumptions,
  getSelfConsumptionItems
};