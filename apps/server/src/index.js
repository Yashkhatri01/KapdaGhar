const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

// health check
app.get("/", (req, res) => {
  res.send("KapdaGhar backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const initDB = require("./db/init");

// after middleware
initDB();

const customerRoutes = require("./routes/customerRoutes");

app.use("/customers", customerRoutes);

const inventoryRoutes = require("./routes/inventoryRoutes");

app.use("/inventory", inventoryRoutes);

const salesRoutes = require("./routes/salesRoutes");

app.use("/sales", salesRoutes);

const cashbookRoutes = require("./routes/cashbookRoutes");

app.use("/cashbook", cashbookRoutes);

const supplierRoutes = require("./routes/supplierRoutes");

app.use("/suppliers", supplierRoutes);

const purchaseRoutes = require("./routes/purchaseRoutes");

app.use("/purchases", purchaseRoutes);

const customerReturnRoutes = require("./routes/customerReturnRoutes");

app.use("/customer-returns", customerReturnRoutes);

const supplierReturnRoutes = require("./routes/supplierReturnRoutes");

app.use("/supplier-returns", supplierReturnRoutes);

const reportRoutes = require("./routes/reportRoutes");

app.use("/reports", reportRoutes);

const selfConsumptionRoutes = require("./routes/selfConsumptionRoutes");

app.use("/self-consumptions", selfConsumptionRoutes);