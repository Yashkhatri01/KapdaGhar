const service = require("../services/customerService");

// POST /customers
async function createCustomer(req, res) {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await service.addCustomer(name, phone);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /customers
async function listCustomers(req, res) {

  try {

    const search = req.query.search || "";

    const data =
      await service.getAllCustomers(search);

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

// PUT /customers/:id
async function editCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const data = await service.updateCustomer(
      id,
      name,
      phone
    );

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

// DELETE /customers/:id
async function removeCustomer(req, res) {
  try {
    await service.deleteCustomer(req.params.id);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  createCustomer,
  listCustomers,
  editCustomer,
  removeCustomer,
};