# Gifts Billing & POS System - Quick Reference Guide

## 🎁 System Overview

This is a complete Point-of-Sale (POS) and billing system for gift e-commerce, implemented as a new module within your existing admin panel.

**MVP Status:** ✅ Complete & Ready for Testing
**Features:** Billing, Invoicing, Product Management, Customer Lookup, Payment Processing, PDF Generation

---

## 📂 File Structure

```
src/app/gifts/
├── types/
│   └── index.ts                    # All TypeScript interfaces
├── utils/
│   ├── calculations.ts             # Math & formatting functions
│   └── validations.ts              # Input validation functions
├── data/
│   └── mockData.ts                 # Test data (8 products, 3 customers)
├── services/
│   ├── giftsFirestoreService.ts   # Firebase CRUD operations
│   └── pdfGeneratorService.ts     # PDF invoice generation
├── hooks/
│   ├── useBillCalculations.ts     # Bill state & calculations
│   ├── useProductInventory.ts     # Product filtering & stock
│   └── useCustomerSearch.ts       # Customer lookup
├── components/
│   ├── ProductCard.tsx             # Product display component
│   ├── BillSummary.tsx            # Bill breakdown component
│   ├── CustomerSearch.tsx         # Customer lookup component
│   ├── PaymentModal.tsx           # Payment processing modal
│   └── InvoicePreview.tsx         # Invoice display modal
└── pages/
    ├── GiftsBilling.tsx            # Main billing interface
    └── InvoiceHistory.tsx          # Bill history & search

DOCUMENTATION:
├── GIFTS_BILLING_README.md         # Comprehensive feature guide
└── IMPLEMENTATION_CHECKLIST.md     # What's done & what's next
```

---

## 🚀 How to Access the System

### In the Admin Panel:

1. Open the admin panel
2. Look for **"Gifts Billing"** in the left sidebar (green Gift icon)
3. Click to enter the Gifts Billing System

### The Two Main Pages:

#### **Page 1: Gifts Billing (Main)**

- **URL ID:** `gifts-billing`
- **Purpose:** Create new bills
- **Features:**
  - Search for customers by phone or name
  - Browse product catalog by category
  - Add products to bill with quantities
  - See real-time bill totals
  - Process payment (multiple payment methods)
  - Generate invoice PDF automatically
  - Save bill to database

#### **Page 2: Invoice History**

- **URL ID:** `gifts-invoice-history`
- **Purpose:** View, search, manage past bills
- **Features:**
  - View all invoices
  - Search by bill number, customer phone, or amount
  - See summary statistics (revenue, count, average)
  - Preview any invoice
  - Print invoice
  - Download PDF
  - Delete invoice

---

## 💡 Step-by-Step: Create Your First Bill

### 1. **Search for Customer**

```
- Click on "Search for Customer"
- Enter their phone number (10 digits) OR name
- Click "Search"
- Select customer from results
- If new customer, click "Create New Customer" button
```

### 2. **Browse & Add Products**

```
- View products in grid
- Filter by category using buttons (All, Gifts, Accessories, etc.)
- Search product by name
- Click on a product
- Select quantity using +/- buttons
- Click "Add to Bill" button
```

### 3. **Review Bill**

```
- Bill summary appears on the right sidebar
- See all items with prices and taxes
- Automatic calculations:
  * Subtotal
  * Tax (GST at product's rate)
  * Applied discounts (if any)
  * Total amount
  * Balance due
```

### 4. **Process Payment**

```
- Click "Proceed to Payment" button
- Modal opens with payment options:
  * CARD (Visa, Mastercard, etc.)
  * UPI (Google Pay, PhonePe, etc.)
  * BANK TRANSFER (Account, IFSC, Reference)
  * DIGITAL WALLET (Paytm, etc.)
- Enter amount paid
- Add reference if needed (card number, cheque #, etc.)
- Click "Add Payment" for multiple payment methods
- See balance/change calculation
- Click "Complete Sale" when fully paid
```

### 5. **Invoice & Save**

```
- Automatic after payment:
  * Invoice PDF is generated
  * Invoice is saved to database
  * Bill is cleared for next customer
- Success message appears
- Bill is ready for printing/download
```

---

## 📊 Sample Data

### Products (8 Samples)

| Product                  | Price  | Category    | Tax | Stock |
| ------------------------ | ------ | ----------- | --- | ----- |
| Personalized Photo Frame | ₹599   | Gifts       | 18% | 50    |
| Luxury Watch             | ₹4,999 | Accessories | 28% | 15    |
| Silk Scarf Gift Pack     | ₹1,999 | Gifts       | 18% | 30    |
| Engraved Pen Set         | ₹799   | Gifts       | 12% | 25    |
| Ceramic Mug              | ₹349   | Home Decor  | 5%  | 100   |
| Wooden Jewellery Box     | ₹1,299 | Home Decor  | 12% | 20    |
| Perfume Bottle           | ₹2,499 | Gifts       | 28% | 12    |
| Customized T-Shirt       | ₹449   | Clothing    | 5%  | 60    |

### Customers (3 Samples)

| Name        | Phone      | Purchases | Total Spent |
| ----------- | ---------- | --------- | ----------- |
| Raj Sharma  | 9876543210 | 5         | ₹8,999      |
| Priya Patel | 9876543211 | 8         | ₹15,499     |
| Amit Verma  | 9876543212 | 3         | ₹4,299      |

---

## 🔢 Tax Rates (GST)

Supported GST slabs:

- **5%** - Essential items (some e-commerce)
- **12%** - Some packaged items
- **18%** - Most gifts and gifts
- **28%** - Luxury items, premium gifts

Each product has its own tax rate configured.

---

## 💳 Payment Methods

Currently Supported:

1. **Card** - Debit/Credit card with reference number
2. **UPI** - Digital payment (Google Pay, PhonePe, etc.)
3. **Bank Transfer** - Direct bank transfer with account details
4. **Wallet** - Digital wallets (Paytm, etc.)

**Split Payments:** Yes! You can mix payment methods:

- ₹1,000 via Card + ₹2,000 via UPI for a ₹3,000 bill

---

## 📋 Key Features Explained

### ✅ Stock Management

- Shows "Out of Stock" badge if 0 units available
- Shows "Low Stock" badge if ≤5 units
- Can't add out-of-stock items to bill
- Stock reserved when bill is created (not yet fully implemented, Phase 2)

### ✅ Calculation Accuracy

- Item subtotal = Quantity × Unit Price
- Item tax = Item Subtotal × GST Rate
- Bill subtotal = Sum of all items
- Bill tax = Sum of all item taxes
- Discount = Percentage, Fixed amount, or Coupon (Phase 2)
- **Total = Subtotal + Tax - Discount**

### ✅ PDF Invoice

Automatically generated with:

- Invoice number (INV-YYYYMMDD-RANDOM)
- Business branding & contact info
- Customer details
- Itemized list with prices & taxes
- Calculation breakdown
- Payment information
- Professional layout ready to print

### ✅ Search Capabilities

In Invoice History page, search by:

- **Bill Number:** "BILL-2026-1234567-ABC"
- **Phone Number:** "9876543210"
- **Amount:** "₹3,500"

---

## 🔧 Configuration & Setup

### Firebase Connection

Currently using mock data. To connect to real Firebase:

1. Create `.env.local` file in project root:

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. Update `src/app/services/firebase-config.ts` to read from `.env.local`

3. System will automatically connect to Firestore collections:
   - `gifts-bills` - All invoices
   - `gifts-products` - Product catalog
   - `gifts-customers` - Customer database

### Collections Structure (Firestore)

```
gifts-bills/
├── billData: {
│   billId: string
│   billNumber: string
│   billDate: Timestamp
│   customerId: string
│   items: [{ productId, name, qty, price, tax, total }]
│   subtotal: number
│   totalTax: number
│   totalDiscount: number
│   total: number
│   payments: [{ method, amount, reference }]
│   paidAmount: number
│   balanceDue: number
│   status: "pending" | "paid" | "partial"
│   notes: string
│   invoicePdfUrl: string
│}

gifts-products/
├── productData: {
│   id: string
│   name: string
│   price: number
│   stock: number
│   category: string
│   taxRate: number
│   imageUrl: string
│   isActive: boolean
│}

gifts-customers/
├── customerData: {
│   customerId: string
│   phone: string
│   name: string
│   email: string
│   city: string
│   pincode: string
│   totalPurchases: number
│   totalSpent: number
│   lastPurchaseDate: Timestamp
│}
```

---

## 🎯 Working Features (MVP)

### ✅ Product Management

- [x] Browse all products
- [x] Filter by category
- [x] Search by name
- [x] View price & tax rate
- [x] Check stock availability
- [x] Add to bill with quantity

### ✅ Customer Management

- [x] Search existing customers
- [x] Quick create new customer
- [x] View customer details
- [x] See purchase history
- [x] Identify returning customers

### ✅ Bill Creation

- [x] Add multiple products
- [x] Modify quantities
- [x] Remove items
- [x] Real-time calculations
- [x] View bill summary

### ✅ Payment Processing

- [x] Multiple payment methods
- [x] Split payments (mixed methods)
- [x] Partial payment support
- [x] Payment reference tracking
- [x] Balance/change calculation

### ✅ Invoice Generation

- [x] Automatic PDF generation
- [x] Professional formatting
- [x] Print-ready layout
- [x] Download PDF
- [x] Email ready (Phase 2)

### ✅ Invoice History

- [x] View all invoices
- [x] Search by bill number
- [x] Search by phone
- [x] Search by amount
- [x] View summary stats
- [x] Preview invoice
- [x] Download PDF
- [x] Delete invoice

### ✅ Responsive Design

- [x] Mobile (320px) - Single column
- [x] Tablet (768px) - Two columns
- [x] Desktop (1024px+) - Three columns

---

## 🚫 Known Limitations (Phase 1)

| Feature              | Status     | Notes                          |
| -------------------- | ---------- | ------------------------------ |
| Stock Auto-decrement | ⏳ Phase 2 | Tracks but doesn't auto-update |
| Edit Bill After Save | ⏳ Phase 2 | Bills accepted (no edits)      |
| Inventory Management | ⏳ Phase 2 | Can view, can't update stock   |
| Discounts UI         | ⏳ Phase 2 | Backend ready, no UI           |
| WhatsApp Sharing     | ⏳ Phase 2 | Ready, needs Twilio setup      |
| Email Delivery       | ⏳ Phase 2 | Ready, needs SendGrid setup    |
| Analytics            | ⏳ Phase 3 | Reports ready, no dashboard    |
| Multi-user           | ⏳ Phase 3 | Single user only for Phase 1   |

---

## 🐛 Troubleshooting

### Problem: Products don't load

**Solution:** Check if Firebase is connected. If using mock data, products should load instantly.

### Problem: Bill calculation is wrong

**Solution:** Each product has a tax rate. Check if product's tax % is correct. Calculation: Subtotal + (Subtotal × Tax%) = Total

### Problem: PDF won't download

**Solution:** Check browser downloads are enabled. PDF is generated client-side, no server needed.

### Problem: Customer not found

**Solution:**

- Search by phone must be 10 digits
- Search by name must be 3+ characters
- Try partial name match

### Problem: Payment modal won't close

**Solution:** Ensure total is ≤ balance due. Can't over-pay a bill.

---

## 📞 Support

If you encounter issues:

1. Check the browser console (F12 → Console tab) for error messages
2. Verify Firebase credentials are correct
3. Clear browser cache and reload
4. Check that all dependencies are installed (`npm install`)
5. Ensure TailwindCSS is compiled

---

## 📚 Additional Documentation

For complete details, see:

- **GIFTS_BILLING_README.md** - Full documentation
- **IMPLEMENTATION_CHECKLIST.md** - What's done & next steps

---

**Last Updated:** Phase 1 Complete ✅
**Next Phase:** Phase 2 (WhatsApp, Discounts, Inventory)
