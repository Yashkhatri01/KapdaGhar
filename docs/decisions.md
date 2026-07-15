# KapdaGhar – Architecture Decisions

_Last Updated: 28 June 2026_

---

# Project Goal

KapdaGhar is an offline-first garment shop management system being built initially for a family retail shop.

Primary requirements:

- Works completely offline
- Runs on Windows 7
- Supports very old hardware (Intel Pentium Dual-Core E2160, 2 GB RAM)
- Stable memory usage
- Easy debugging
- Professional architecture
- Future migration to desktop wrapper and cloud should be possible

---

# Technology Stack

Frontend

- React
- Vite

Backend

- Node.js
- Express

Database

- SQLite

Language

- JavaScript (backend)
- TypeScript (frontend)

---

# Overall Architecture

The project is divided into independent applications.

```
KapdaGhar

apps/
    desktop-ui/
    server/

shared/

database/

docs/
```

---

# Backend Architecture

Every feature follows the same pattern.

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
SQLite
```

Business logic belongs only inside Services.

Controllers only:

- validate requests
- call services
- return responses

Routes only map URLs.

---

# Folder Structure

Server contains

```
controllers/
routes/
services/
db/
middleware/
validators/
constants/
utils/
```

---

# Naming Convention

Services use singular names.

Examples

```
customerService.js
inventoryService.js
saleService.js
supplierService.js
purchaseService.js
cashbookService.js
```

Routes also follow singular file names.

Examples

```
customerRoutes.js
saleRoutes.js
purchaseRoutes.js
```

API endpoints remain plural.

```
/customers
/sales
/purchases
```

---

# Database Philosophy

The schema is designed first.

Frontend must adapt to the schema.

Breaking database changes should be avoided after frontend development begins.

---

# Inventory Design

Inventory stores current stock.

Fields

```
item_name
category
brand
size
color
purchase_price
selling_price
stock
min_stock
barcode
```

Stock is stored as a cached value for performance.

---

# Inventory Transactions

Every stock movement must also be recorded.

Movement types

```
PURCHASE
SALE
RETURN_CUSTOMER
RETURN_SUPPLIER
SELF_CONSUMPTION
DAMAGE
ADJUSTMENT
```

This table provides a complete audit history.

---

# Sales Design

Sales are normalized.

Tables

```
sales
sale_items
```

sales stores invoice information.

sale_items stores every item inside the bill.

Sales should never directly manipulate inventory.

Inventory updates happen through reusable services.

---

# Purchase Design

Purchases mirror Sales.

Tables

```
purchases
purchase_items
```

Purchases

- increase inventory
- create inventory transactions
- create cashbook entries

---

# Cashbook

Cashbook records money movement.

Use

```
transaction_type
```

instead of

```
type
```

---

# Shared Constants

Shared constants live inside

```
shared/constants
```

Examples

```
inventoryMovements.js
paymentMethods.js
paymentStatus.js
```

Frontend and backend both use these constants.

---

# Business Philosophy

The system models business operations instead of simple CRUD.

Inventory movements include

- Purchase
- Sale
- Customer Return
- Supplier Return
- Self Consumption (family use)
- Damage
- Manual Adjustment

Self Consumption represents stock used by the family.

Revenue

```
₹0
```

Inventory decreases.

Business cost equals purchase price.

It is not treated as a Sale.

---

# Development Philosophy

First

- build correct architecture

Then

- implement business logic

Finally

- build frontend

Optimization and refactoring happen after the MVP is complete.

---

# Git Philosophy

Commits represent completed work.

Never commit planned work.

Commit messages follow Conventional Commits.

Examples

```
feat(inventory): implement inventory management

feat(purchases): implement purchase workflow

refactor(database): finalize production-ready schema
```

---

# Current Progress

Completed

- Backend architecture
- SQLite integration
- Customers
- Inventory
- Sales
- Cashbook
- Suppliers

In Progress

- Database redesign
- Inventory transactions
- Sale items

Next

- Purchases
- Purchase returns
- Sales returns
- Self consumption
- Stock adjustments
- Reports
- React frontend
- Windows deployment