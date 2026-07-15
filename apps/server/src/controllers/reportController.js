const reportService = require("../services/reportService");

/**
 * Sales Summary
 */
async function getSalesSummary(req, res) {

  try {

    const summary =
      await reportService.getSalesSummary();

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

/**
 * Purchase Summary
 */
async function getPurchaseSummary(req, res) {

  try {

    const summary =
      await reportService.getPurchaseSummary();

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

/**
 * Profit Summary
 */
async function getProfitSummary(req, res) {

  try {

    const summary =
      await reportService.getProfitSummary();

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

module.exports = {
  getSalesSummary,
  getPurchaseSummary,
  getProfitSummary
};