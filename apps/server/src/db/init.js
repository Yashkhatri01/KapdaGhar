const db = require("./connection");

function initDB() {
  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Inventory table
  db.run(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    size TEXT,
    color TEXT,
    purchase_price REAL NOT NULL CHECK (purchase_price >= 0),
    selling_price REAL NOT NULL CHECK (selling_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    barcode TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    inventory_id INTEGER NOT NULL,

    movement_type TEXT NOT NULL,

    quantity INTEGER NOT NULL,

    reference_type TEXT,

    reference_id INTEGER,

    remarks TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(inventory_id) REFERENCES inventory(id)
    )
  `);

  // Sales table
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      subtotal REAL NOT NULL CHECK (subtotal >= 0),
      discount REAL NOT NULL DEFAULT 0 CHECK (discount >= 0),
      tax REAL NOT NULL DEFAULT 0 CHECK (tax >= 0),
      grand_total REAL NOT NULL CHECK (grand_total >= 0),
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'PAID',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
    
      sale_id INTEGER NOT NULL,
      inventory_id INTEGER NOT NULL,
    
      quantity INTEGER NOT NULL,
      selling_price REAL NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
    
      FOREIGN KEY(sale_id) REFERENCES sales(id),
      FOREIGN KEY(inventory_id) REFERENCES inventory(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cashbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      transaction_type TEXT NOT NULL,

      amount REAL NOT NULL,

      description TEXT,

      reference_type TEXT,

      reference_id INTEGER,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

db.run(`
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
)
`);

db.run(`
    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      inventory_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_cost REAL NOT NULL,
      total REAL NOT NULL,

      FOREIGN KEY(purchase_id) REFERENCES purchases(id),
      FOREIGN KEY(inventory_id) REFERENCES inventory(id)
    );
  `);


  // Customer Returns

db.run(`
  CREATE TABLE IF NOT EXISTS customer_returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    sale_id INTEGER NOT NULL,

    customer_id INTEGER,

    total REAL NOT NULL,

    status TEXT NOT NULL DEFAULT 'RETURNED',

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sale_id)
      REFERENCES sales(id),

    FOREIGN KEY (customer_id)
      REFERENCES customers(id)
    );
  `);

  // Customer Return Items

db.run(`
  CREATE TABLE IF NOT EXISTS customer_return_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer_return_id INTEGER NOT NULL,

    sale_item_id INTEGER NOT NULL,

    inventory_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    unit_price REAL NOT NULL,

    total REAL NOT NULL,

    FOREIGN KEY (customer_return_id)
      REFERENCES customer_returns(id),

    FOREIGN KEY (sale_item_id)
      REFERENCES sale_items(id),

    FOREIGN KEY (inventory_id)
      REFERENCES inventory(id)
    );
  `);

  db.run(`
CREATE TABLE IF NOT EXISTS customer_return_exchange_items (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer_return_id INTEGER NOT NULL,

    inventory_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    selling_price REAL NOT NULL,

    total REAL NOT NULL,

    FOREIGN KEY(customer_return_id)
      REFERENCES customer_returns(id),

    FOREIGN KEY(inventory_id)
      REFERENCES inventory(id)

)
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS supplier_returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    purchase_id INTEGER NOT NULL,

    supplier_id INTEGER NOT NULL,

    total REAL NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (purchase_id)
      REFERENCES purchases(id),

    FOREIGN KEY (supplier_id)
      REFERENCES suppliers(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS supplier_return_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    supplier_return_id INTEGER NOT NULL,

    purchase_item_id INTEGER NOT NULL,

    inventory_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    unit_cost REAL NOT NULL,

    total REAL NOT NULL,

    FOREIGN KEY (supplier_return_id)
      REFERENCES supplier_returns(id),

    FOREIGN KEY (purchase_item_id)
      REFERENCES purchase_items(id),

    FOREIGN KEY (inventory_id)
      REFERENCES inventory(id)
    );
  `);


  // Self Consumptions

db.run(`
  CREATE TABLE IF NOT EXISTS self_consumptions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    total_cost REAL NOT NULL,

    remarks TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    );
  `);

  // Self Consumption Items

db.run(`
  CREATE TABLE IF NOT EXISTS self_consumption_items (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    self_consumption_id INTEGER NOT NULL,

    inventory_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    unit_cost REAL NOT NULL,

    total REAL NOT NULL,

    FOREIGN KEY (self_consumption_id)
        REFERENCES self_consumptions(id),

    FOREIGN KEY (inventory_id)
        REFERENCES inventory(id)

    );
  `);


  console.log("Database initialized");
}



module.exports = initDB;