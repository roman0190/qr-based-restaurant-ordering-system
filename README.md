# QR Based Local Restaurant Ordering Web App – Full System Idea (Improved)

## 📌 Project Overview

This is a Next.js-based local-network restaurant web application, designed to run only inside the restaurant WiFi. No mobile app installation is required. Customers scan a static QR code at their table to open the web app, place orders, modify orders within limits, and get service.

The system ensures security, fairness, and control: only the last scanned device can control a table order for a limited 10-minute session. If a customer wants to edit an order, they must scan the QR code again, and all changes are logged. Admins, waiters, and kitchen staff get notifications on changes in real time.

The system has a Customer Ordering Interface, Waiter/Staff Panel, Kitchen Panel, and a powerful Admin Dashboard.

---

## 🌐 Network & Access Rules
- **Entire system runs on local server / LAN IP** (not public internet)
- **Website opens only when connected to restaurant WiFi**
- **Outside access is blocked** → prevents fake orders and remote manipulation
- **Old QR scans cannot control the table** once a new scan happens

---

## 📲 QR Code System (Table Tracking)
- **Each table has a static QR code** → `/order?table={tableId}`
- **QR codes are generated & printed from Admin Dashboard**
- **Admin can:**
  - Add/remove tables
  - Generate QR codes
  - Download & print QR codes
- **Last Scan Wins Rule** → only the most recent device can edit orders
- **10-Minute Session Rule** → session expires after 10 minutes; customer must scan QR again to modify

---

## 🪑 Table & Order Control Logic
- **Order Editing:**
  - To edit an existing order, customer must scan QR again
  - Any changes (add/remove items, quantity, notes) trigger real-time notifications to waiter, kitchen, and admin
- **Order Cancel:**
  - Customers can cancel orders within 5 minutes of placement
- **History Tracking:**
  - A monitor view shows all tables’ order history
  - For each table: order placed, edits, cancellations, time, and customer actions

---

## 🧾 Ordering Flow (Customer Side)

### Dine-In
1. **Scan table QR** → start 10-minute control session
2. **Select menu items**
3. **Choose payment option:**
   - Pay First → prepaid
   - Pay After Eating → postpaid
4. **Confirm order** → status: `WAITING_FOR_WAITER_CONFIRMATION`
5. **Order locked after waiter confirms** → status: `CONFIRMED`
6. **Edit Order:** scan QR again → make changes → notifications sent
7. **Cancel Order:** within 5 minutes → updates table & sends notifications

### Parcel Order
- Select items → optionally pay → order goes directly to kitchen
- No table/QR needed

---

## 👨‍🍳 Waiter / Staff Workflow
- **Login required** → role-based access (WAITER only)
- **Dashboard shows:**
  - Orders waiting for confirmation
  - Table number & current session info
  - Items, quantity, notes, order time
  - Payment mode (Pay First / Pay After)
- **Manual Confirmation Flow:**
  1. Customer confirms order
  2. Status becomes `WAITING_FOR_WAITER_CONFIRMATION`
  3. Waiter verifies order → clicks Confirm → status: `CONFIRMED`
- **Notifications:**
  - Any customer edit or cancellation triggers waiter notification

---

## 👨‍🍳 Kitchen Panel (KDS)
- **Separate login** → role-based (KITCHEN only)
- **Displays confirmed orders only**
- **Real-time updates** → socket or auto-refresh
- **Shows:**
  - Table number
  - Items & quantity
  - Notes / special instructions
  - Order time
- **Kitchen updates order status:**
  - `CONFIRMED` → `PREPARING` → `READY` → `SERVED`

---

## 💳 Payment System
1. **Pay First (Prepaid)** → order proceeds after payment success
2. **Pay After (Postpaid)** → customer eats first → bill generated → payment confirmed by waiter/admin
3. **All payments logged** → reflected in daily sales

---

## 🧑‍💼 Admin Dashboard (Full Control)

### Table Management
- Add/remove tables
- Generate & print QR codes
- Track table session status

### Menu Management
- Create/edit categories
- Add/edit menu items
- Upload carousel/header/footer images → display dynamically
- Enable/disable items
- Admin can update carousel & header/footer images anytime

### Order Management
- View all orders & history
- Track order status real-time
- Filter by date, table, payment type
- See edits & cancellations, who changed, and when

### Notifications & Monitoring
- Admin, waiter, and kitchen receive real-time notifications on:
  - Customer order changes
  - Cancellations
  - Session expirations
- All-table monitor shows:
  - Current orders
  - Table sessions
  - Edit history

### Daily Sales & Reports
- Total orders & revenue
- Paid vs unpaid orders
- Dine-in vs parcel summary
- Exportable reports

---

## 🔒 System Advantages
- **No mobile app required**
- **No internet dependency** (LAN/WiFi only)
- **Highly secure:** session + last scan logic + 10-min timeout
- **Prevents fake/duplicate orders**
- **Admin can manage carousel/header/footer dynamically**
- **Customers can edit or cancel within limits** → notifications sent
- **Complete table history monitor** → track all orders, edits, cancellations

---

## 🧾 One-Line Summary
A Next.js local restaurant web app where customers scan static table QR codes to place dine-in or parcel orders inside the restaurant WiFi. Only the latest scan can control a table for 10 minutes, order edits require QR rescan, notifications are sent on changes, waiter confirmation locks orders, and admins manage tables, QR codes, menu, images, and daily confirmed sales with a full history monitor.

---

## ✅ Improvements added in this version:
1. Carousel/header/footer images editable via admin
2. Customer can edit order only by rescanning QR
3. Customer can cancel order within 5 minutes
4. Real-time notifications for edits/cancellations
5. All-table monitor showing history and current status

---

# 🍽️ QR-Based Restaurant Ordering Web App – Workflow

## 1️⃣ Customer Side Flow

### Step 1: QR Scan
- Customer table এ বসে QR code scan করে → `/order?table={tableId}`
- System checks:
  - Device is connected to restaurant WiFi
  - Table session validity
- Creates a 10-minute control session for this device
- Previous sessions for this table are invalidated
- Customer can now place or edit orders

### Step 2: Select Items
- Customer browses menu categories
- Adds items to cart
- Can add notes (e.g., spicy, no onion)
- Menu items may include images, vegetarian/non-veg indicator, and price

### Step 3: Payment Option
- **Pay First** → prepaid, amount added
- **Pay After Eating** → postpaid, payable by waiter after meal

### Step 4: Order Confirmation
- Customer confirms order
- Status becomes: `WAITING_FOR_WAITER_CONFIRMATION`
- Notifications sent to:
  - Waiter → “New order waiting”
  - Admin → “New order placed”
  - Kitchen (if pay-first) → “Order pending confirmation”

### Step 5: Order Edit
- Customer wants to edit order → must scan QR again
- After rescan:
  - Changes allowed (add/remove items, notes, quantity)
  - Session timer resets to 10 minutes
- Notifications sent to:
  - Waiter → “Order updated”
  - Kitchen → “Order updated”
  - Admin → “Order updated”
- Edits logged in all-table monitor

### Step 6: Order Cancel
- Customer can cancel within 5 minutes
- Upon cancellation:
  - Order removed from current queue
  - Notifications sent to waiter/kitchen/admin
  - History tracked in monitor

---

## 2️⃣ Waiter / Staff Flow

### Step 1: Login
- Waiter logs in → role-based access (WAITER)
- Dashboard shows:
  - Orders waiting for confirmation
  - Table number and session info
  - Items, quantity, notes
  - Payment mode

### Step 2: Manual Confirmation
- Customer confirms → order status = `WAITING_FOR_WAITER_CONFIRMATION`
- Waiter visits table, verifies order
- Waiter clicks Confirm → order status becomes `CONFIRMED`
- Table gets locked → customer cannot edit unless QR rescanned

### Step 3: Notifications
- Waiter receives updates if:
  - Customer edits order after rescanning QR
  - Customer cancels order
  - Session expires

---

## 3️⃣ Kitchen Panel (KDS)

### Step 1: Login
- Kitchen staff logs in → role-based (KITCHEN only)
- Can only see `CONFIRMED` orders

### Step 2: Real-time Monitoring
- Shows:
  - Table number
  - Ordered items & quantity
  - Notes / instructions
  - Order time
- Real-time updates via websocket or auto-refresh

### Step 3: Order Status Updates
- Kitchen staff updates status:
  - `CONFIRMED` → `PREPARING` → `READY` → `SERVED`
- Notifications sent to:
  - Admin
  - Waiter
  - (Optional) Customer if app shows status

---

## 4️⃣ Admin Dashboard Flow

### Step 1: Login
- Admin logs in → full access
- Dashboard shows:
  - Tables & sessions
  - Orders (current + history)
  - Daily sales & reports
  - Carousel / header / footer images

### Step 2: Table & QR Management
- Add/remove tables
- Generate QR codes → download & print
- Track session activity

### Step 3: Menu Management
- Create/edit categories
- Add/edit menu items
- Enable/disable items
- Upload carousel/header/footer images

### Step 4: Order Monitoring
- Real-time view of:
  - All orders per table
  - Edits & cancellations (who, when)
  - Notifications for changes

### Step 5: Daily Sales & Reports
- Total revenue, paid/unpaid
- Dine-in vs parcel
- Exportable reports

---

## 5️⃣ Notifications & History Tracking
- **Trigger Events:**
  - New order placed
  - Order edited
  - Order canceled
  - Session expired
- **Notifications sent to:**
  - Waiter
  - Kitchen
  - Admin
- **All-table monitor:**
  - Shows each table’s history
  - Orders, edits, cancellations, session timestamps
  - Who made changes

---

## 6️⃣ Session & Security Logic
- **Last Scan Wins:** only latest scanned device can control table
- **10-Minute Session:** after 10 minutes, edits blocked
- **QR must be rescanned to:**
  - Edit order
  - Resume session
- Prevents outside manipulation or duplicate/fake orders

---

## 🔁 Summary Workflow (Stepwise)
1. Customer scans QR → session created
2. Customer places order → `WAITING_FOR_WAITER_CONFIRMATION`
3. Notifications sent → Waiter/Admin/Kitchen
4. Waiter confirms order → `CONFIRMED` → Kitchen gets order
5. Kitchen updates status → `PREPARING` → `READY` → `SERVED`
6. Customer edits (optional) → rescans QR → notifications sent
7. Customer cancels (optional) → within 5 min → notifications sent
8. Admin monitors all tables → session history, order changes, payments, carousel/header/footer updates
9. Daily sales & reports → summary & export

---

# 🍽️ Next.js QR Restaurant Web App – Full Dev Flow (Step by Step)

## Step 0 – Project Setup
1. **Create Next.js project:**
   ```bash
   npx create-next-app@latest qr-restaurant
   cd qr-restaurant
   ```
2. **Install dependencies:**
   ```bash
   npm install mongoose zod bcryptjs jsonwebtoken socket.io-client socket.io
   npm install -D typescript @types/node @types/react
   ```
3. **Setup folder structure:**
   - `/pages/api` → API routes (backend)
   - `/pages` → Frontend pages (Customer, Admin, Waiter, Kitchen)
   - `/components` → React components (Tables, Menu, Carousel, Header, Footer)
   - `/schemas` → Zod validation schemas
   - `/models` → Mongoose models
   - `/lib` → Database connection & helpers
   - `/context` → React context (User auth, Socket)
   - `/utils` → Utils & helper functions
   - `/public/images` → Carousel / header / footer images

## Step 1 – MongoDB Setup
1. Install MongoDB locally or use Atlas.
2. Create database: `qrRestaurant`
3. Create `lib/mongoose.ts`:
   ```typescript
   import mongoose from "mongoose";

   const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/qrRestaurant";

   let cached = global.mongoose;

   if (!cached) cached = global.mongoose = { conn: null, promise: null };

   export async function dbConnect() {
     if (cached.conn) return cached.conn;
     if (!cached.promise) {
       cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
     }
     cached.conn = await cached.promise;
     return cached.conn;
   }
   ```

## Step 2 – Authentication
- **Roles:** ADMIN, WAITER, KITCHEN
- Use `bcryptjs` to hash passwords
- JWT for session management
- **API routes:**
  - `pages/api/auth/login.ts` → login
  - `pages/api/auth/logout.ts` → logout
  - `pages/api/auth/me.ts` → current user

## Step 3 – Table & QR Codes
1. **Models:**
   - `Table`: `{ number, name, qrCodeId, isOccupied }`
   - `QRCode`: `{ tableId, path, static: true }`
2. **API routes:**
   - `pages/api/admin/tables.ts` → CRUD tables
   - `pages/api/admin/qrcodes.ts` → generate/download QR codes
3. **Logic:**
   - Last Scan Wins
   - 10-minute session for order modification

## Step 4 – Menu & Categories
- **Models:**
  - `Category`: `{ name, description, position }`
  - `MenuItem`: `{ name, price, categoryId, isAvailable, imageUrl, isVeg }`
- **API routes:**
  - `pages/api/admin/categories.ts` → CRUD categories
  - `pages/api/admin/menu-items.ts` → CRUD items
  - Admin can update carousel/header/footer images dynamically

## Step 5 – Customer Ordering Module
1. **Models:**
   - `Order`: `{ tableId?, items[], type, paymentMode, paymentStatus, status, amountPaid?, paymentMethod? }`
   - `TableSession`: `{ tableId, deviceId, startedAt, expiresAt, active }`
2. **API routes:**
   - `pages/api/order/create.ts` → create order
   - `pages/api/order/edit.ts` → edit order (after rescanning QR)
   - `pages/api/order/cancel.ts` → cancel order (within 5 min)
3. **Logic:**
   - Only last scanned device can modify
   - Session expires after 10 minutes
   - Real-time notifications to Waiter/Kitchen/Admin

## Step 6 – Waiter Module
- **Dashboard:**
  - Orders waiting for confirmation
  - Table number & session info
  - Items, quantity, notes
  - Payment mode
- **API routes:**
  - `pages/api/waiter/confirm.ts` → confirm order
  - `pages/api/waiter/pay.ts` → mark pay-after as paid
- Notifications on customer edits or cancellations

## Step 7 – Kitchen Module (KDS)
- **Dashboard:**
  - Displays confirmed orders only
  - Table number, items, quantity, notes
  - Real-time updates via socket.io
- **API routes:**
  - `pages/api/kitchen/orders.ts` → get confirmed orders
  - `pages/api/kitchen/status.ts` → update order status (PREPARING → READY → SERVED)

## Step 8 – Admin Dashboard
- **Features:**
  - Manage tables & QR codes
  - Manage menu & categories
  - Manage carousel/header/footer images
  - Monitor all-table orders & history
  - Notifications for edits/cancellations
  - Daily sales & reports
- **API routes:**
  - `pages/api/admin/orders.ts` → fetch all orders with history
  - `pages/api/admin/sales.ts` → daily sales summary

## Step 9 – Notifications (Socket.io)
- **Events:**
  - `NEW_ORDER`
  - `EDIT_ORDER`
  - `CANCEL_ORDER`
  - `SESSION_EXPIRED`
  - `ORDER_CONFIRMED`
- **Subscribers:**
  - Waiter, Kitchen, Admin dashboards
  - Optionally Customer UI

## Step 10 – Incremental Dev Flow
1. DB & models first (User, Table, QR, Category, MenuItem, Order)
2. Auth system
3. Table & QR management
4. Menu management
5. Customer order creation
6. Order edit / cancel
7. Waiter confirmation
8. Kitchen order processing
9. Notifications
10. Admin dashboard & reporting
11. Frontend polish → carousel/header/footer, countdown timer
12. Test LAN access + session rules + notifications

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Development: MongoDB / Mongoose setup 🔧

1. Copy `.env.local.example` to `.env.local` and set `MONGODB_URI`.
2. Start the dev server: `npm run dev`.
3. Test the DB connection: `GET /api/mongo-test` (e.g. open http://localhost:3000/api/mongo-test). You should get a JSON response with `ok: true` and `userCount`.

---

### Image uploads

- Admin image uploads are saved to `public/uploads` and the API returns a relative URL (e.g. `/uploads/167...png`).
- When an item is updated with a new image or deleted, the old image file is removed from `public/uploads` automatically.
- Upload endpoint: `POST /api/upload` accepts JSON { filename, data } where `data` is a base64 data URL (the Admin UI uses this method).

### Frontend UI

- Admin UI now uses shadcn-style components (Radix Dialog + Tailwind): `Dialog`, `Button`, `Input`, `Label`, etc.
- Admin Items page `/admin/items` now supports modal-based create/edit with image uploads and delete with confirmation.


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
