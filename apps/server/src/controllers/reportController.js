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

async function dashboard(req, res) {

  try {

    const data =
    await reportService.getDashboardSummary();

    res.json({

      success: true,

      data

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

}

async function salesTrend(req, res) {

  try {

    const data =
      await reportService.getSalesTrend();

    res.json({

      success: true,

      data

    });

  }

  catch (err) {

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

}

async function topProducts(req, res) {

  try {

    const data =
      await reportService.getTopProducts();

    res.json({

      success: true,

      data

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

}

async function lowStock(req, res) {

  try {

    const data =
      await reportService.getLowStockItems();

    res.json({

      success: true,

      data

    });

  }

  catch (err) {

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

}

async function deadStock(req,res){

  try{

    const data=
      await reportService.getDeadStock();

    res.json({

      success:true,

      data

    });

  }

  catch(err){

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

}

async function revenueVsPurchase(req,res){

  try{

    const data =
      await reportService.getRevenueVsPurchase();

    res.json({

      success:true,

      data

    });

  }

  catch(err){

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

}


module.exports = {
  getSalesSummary,
  getPurchaseSummary,
  getProfitSummary,

  dashboard,
  salesTrend,

  topProducts,
  lowStock,
  deadStock,
  revenueVsPurchase,
};