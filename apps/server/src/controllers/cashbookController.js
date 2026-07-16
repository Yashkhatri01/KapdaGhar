const service = require("../services/cashbookService");

// POST entry
async function add(req, res) {
  try {
    const { type, amount, description } = req.body;

    const result = await service.addEntry(type, amount, description);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET entries
async function list(req, res) {

  try {

    const {
      year,
      month,
      day
    } = req.query;

    const data =
      await service.getAll({
        year,
        month,
        day
      });

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

async function summary(req, res) {

  try {

    const {
      year,
      month,
      day
    } = req.query;

    const data =
      await service.getSummary({
        year,
        month,
        day
      });

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

module.exports = {
  add,
  list,
  summary
};