const service = require("../services/supplierService");

async function createSupplier(req, res) {
  try {
    const { name, phone, address } = req.body;

    const supplier = await service.addSupplier(
      name,
      phone,
      address
    );

    res.json({
      success: true,
      data: supplier
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

async function listSuppliers(req, res) {

  try {

    const search = req.query.search || "";

    const data =
      await service.getAllSuppliers(search);

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

// PUT /suppliers/:id
async function editSupplier(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const data = await service.updateSupplier(
      id,
      name,
      phone,
      address
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

// DELETE /suppliers/:id
async function removeSupplier(req, res) {
  try {
    await service.deleteSupplier(req.params.id);

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
  createSupplier,
  listSuppliers,
  editSupplier,
  removeSupplier,
};