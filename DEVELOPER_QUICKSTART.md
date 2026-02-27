# 🚀 Developer Quick Start Guide

## Installation & Setup

### 1. Install Dependencies (if not already done)

```bash
npm install
# or
yarn install
```

### 2. Verify Module Structure

The gifts module is located at: `src/app/gifts/`

All files should be present:

```bash
# Check if gifts directory exists
ls -la src/app/gifts/

# Should show: types/, utils/, services/, hooks/, components/, pages/, data/
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Then navigate to: `http://localhost:5173`

---

## 🧪 Quick Testing Checklist

### Test 1: Navigation

- [ ] Open admin panel
- [ ] Verify "Gifts Billing" appears in sidebar
- [ ] Verify "Gifts Invoices" appears in sidebar
- [ ] Click "Gifts Billing" - should load page
- [ ] Click "Gifts Invoices" - should load page

### Test 2: Product Catalog

- [ ] Verify 8 sample products load
- [ ] Click category filters (All, Gifts, Accessories, etc.)
- [ ] Search for "watch" - should find Luxury Watch
- [ ] Each product should show: name, price, stock, add button
- [ ] Out of stock items should show red badge (if stock=0)

### Test 3: Customer Search

- [ ] Click "Search for Customer"
- [ ] Search by phone: "9876543210" - should find "Raj Sharma"
- [ ] Search by name: "priya" - should find "Priya Patel"
- [ ] Click on customer - should show details
- [ ] Should show "Returning" badge for customers with purchases
- [ ] Click "Create New Customer" - should open form

### Test 4: Bill Creation

- [ ] Add 2-3 products to bill
- [ ] Change quantity using +/- buttons
- [ ] Verify subtotal updates
- [ ] Verify tax calculation (subtotal × tax%)
- [ ] Check total = subtotal + tax
- [ ] Remove an item - bill should update

### Test 5: Payment Processing

- [ ] Click "Proceed to Payment"
- [ ] Modal opens with payment methods
- [ ] Select "Cash", enter amount, click "Add Payment"
- [ ] Amount should appear in payment list
- [ ] Balance due should update (0 if fully paid)
- [ ] Click "Complete Sale"
- [ ] Bill should clear
- [ ] Success message should show

### Test 6: Invoice Preview

- [ ] Click "Preview Bill" (before payment)
- [ ] Should show professional invoice layout
- [ ] Check it displays: customer, items, totals, taxes
- [ ] Verify all calculations are correct
- [ ] Check print button works
- [ ] Check download button works

### Test 7: Invoice History

- [ ] Click "Gifts Invoices"
- [ ] Should see list of bills
- [ ] Stats cards should show:
  - Total Revenue
  - Total Bills
  - Average Bill Value
  - Paid Bills Count
- [ ] Search by bill number
- [ ] Search by phone number
- [ ] Search by amount
- [ ] Preview, print, download, delete actions should work

### Test 8: Responsive Design

- [ ] Open in mobile view (320px width)
- [ ] Layout should be single column
- [ ] No horizontal scroll
- [ ] All buttons accessible
- [ ] Tablet view (768px) - two columns
- [ ] Desktop view (1024px+) - three columns

---

## 🔍 Testing with Browser DevTools

### 1. Open Console (F12)

Check for any errors in red. Expected warnings about Firebase types are OK.

### 2. Test Calculations

Open Console → paste:

```javascript
// Test bill calculation
const subtotal = 3500;
const taxRate = 0.18;
const tax = subtotal * taxRate;
const total = subtotal + tax;
console.log({ subtotal, tax, total });
// Output: { subtotal: 3500, tax: 630, total: 4130 }
```

### 3. Test Date Formatting

```javascript
// In Console
const date = new Date();
const formatted = date.toLocaleDateString("en-IN");
console.log(formatted);
// Should output: DD/MM/YYYY format
```

---

## 📝 Code Structure for Developers

### Where to Find Things

**Adding a new payment method:**

- `src/app/gifts/components/PaymentModal.tsx` - Add to payment methods array

**Changing tax rates:**

- `src/app/gifts/data/mockData.ts` - Modify mockTaxRates array

**Modifying bill calculation:**

- `src/app/gifts/utils/calculations.ts` - Update calculateBillTotals()

**Adding validation:**

- `src/app/gifts/utils/validations.ts` - Add new validation function

**Changing PDF layout:**

- `src/app/gifts/services/pdfGeneratorService.ts` - Modify generateInvoicePDF()

**Adding new page:**

1. Create file in `src/app/gifts/pages/`
2. Update `src/app/App.tsx` - add import and route
3. Update `src/app/components/admin/AdminSidebar.tsx` - add menu item

---

## 🐛 Common Issues & Fixes

### Issue: Module not found error

**Fix:** Ensure relative paths are correct:

```
From: src/app/gifts/pages/GiftsBilling.tsx
To:   src/app/gifts/utils/calculations.ts
Use:  ../utils/calculations.ts
```

### Issue: "Cannot read property of undefined"

**Fix:** Ensure data is loaded before rendering:

```jsx
if (loading) return <div>Loading...</div>;
if (!products) return null;

// Safe to use products here
```

### Issue: Calculation incorrect

**Check:** Product tax rates in `mockData.ts`

```javascript
// Each product needs taxRate field
{ id: '1', name: 'Item', price: 100, taxRate: 18, ... }
```

### Issue: Firebase errors

**Fix:** Currently using mock data. Add real Firebase credentials:

```
.env.local:
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx
... (all 6 variables)
```

---

## 🔄 Key Hooks Usage

### useBillCalculations

```jsx
const {
  items, // Current bill items
  calculations, // { subtotal, tax, discount, total, balanceDue }
  addItem, // Add product to bill
  removeItem, // Remove item from bill
  updateItemQuantity, // Change quantity
  addDiscount, // Apply discount
} = useBillCalculations();
```

### useProductInventory

```jsx
const {
  products, // All products
  filteredProducts, // After filtering
  filterProducts, // Apply filters
  checkAvailability, // Check if in stock
} = useProductInventory();
```

### useCustomerSearch

```jsx
const {
  searchResults, // Found customers
  selectedCustomer, // Active customer
  searchByPhone, // Search by phone
  selectCustomer, // Set active
  createNewCustomer, // Create customer
} = useCustomerSearch();
```

---

## 📊 Adding Test Data

To add sample data, edit `src/app/gifts/data/mockData.ts`:

```typescript
export const mockGiftProducts: GiftProduct[] = [
  {
    id: "1",
    name: "Photo Frame",
    price: 599,
    description: "Personalized frame",
    stock: 50,
    category: "Gifts",
    taxRate: 18,
    imageUrl: "url-or-null",
    isActive: true,
    variants: [],
  },
  // ... add more products
];
```

---

## 🎨 Styling Tips

### Component Styling

Using TailwindCSS classes:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Responsive Values

```
Mobile:  default class (320px+)
Tablet:  md: prefix (768px+)
Desktop: lg: prefix (1024px+)
```

### Common Classes

```
- p-4: Padding
- m-4: Margin
- bg-white: Background
- rounded-lg: Border radius
- shadow-md: Shadow
- hover:bg-gray-100: Hover state
- disabled:opacity-50: Disabled state
```

---

## 🚀 Performance Tips

### 1. Memoization

Use `useMemo` for expensive calculations:

```jsx
const calculations = useMemo(() => {
  return calculateBillTotals(items, discounts);
}, [items, discounts]);
```

### 2. useCallback for Event Handlers

```jsx
const handleAddToCart = useCallback(
  (product) => {
    // Your logic here
  },
  [dependencies],
);
```

### 3. Lazy Load Heavy Components

```jsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>;
```

---

## 🔒 Security Checklist

- [ ] No sensitive data in client-side code
- [ ] Firebase rules configured in Firebase Console
- [ ] Input validation on all forms
- [ ] No console.log of sensitive data
- [ ] Sanitize user inputs
- [ ] HTTPS used in production

---

## 📚 TypeScript Tips

### Define Types for Props

```typescript
interface ProductCardProps {
  product: GiftProduct;
  onAddToCart: (product: GiftProduct) => void;
  isDisabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Component code
};
```

### Type Assertions When Necessary

```typescript
const firebaseData = doc.data() as Bill;
// Now TypeScript knows firebaseData is type Bill
```

---

## 🧹 Clean Code Practices

### ✅ DO

```javascript
const calculateTotal = (subtotal, taxRate) => {
  const tax = subtotal * (taxRate / 100);
  return subtotal + tax;
};
```

### ❌ DON'T

```javascript
const ct = (st, tr) => st + st * (tr / 100); // Unclear naming
```

### ✅ DO

```typescript
if (bill.total > 0 && bill.balanceDue === 0) {
  markAsPaid();
}
```

### ❌ DON'T

```javascript
if (bill.total && !bill.balanceDue) {
  // Unclear logic
  markAsPaid();
}
```

---

## 🔧 Environment Variables

Create `.env.local` in project root:

```
# Firebase
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# API Keys (Phase 2+)
VITE_TWILIO_ACCOUNT_SID=xxx
VITE_TWILIO_AUTH_TOKEN=xxx
VITE_SENDGRID_API_KEY=xxx
```

**Note:** Never commit `.env.local` to git. Add to `.gitignore`:

```
.env.local
.env.*.local
```

---

## 📞 Debug Helpers

### Log Bill State

```jsx
useEffect(() => {
  console.table({
    items: items.length,
    subtotal: calculations.subtotal,
    total: calculations.total,
    balanceDue: calculations.balanceDue,
  });
}, [items, calculations]);
```

### Track Renders

```jsx
useEffect(() => {
  console.log("GiftsBilling component rendered");
  return () => console.log("GiftsBilling component unmounted");
}, []);
```

### Check Product Filter

```jsx
useEffect(() => {
  console.log(`Filtered products: ${filteredProducts.length}`);
}, [filteredProducts]);
```

---

## 🎯 Next Steps for Development

1. **Test MVP Features** - Follow testing checklist above
2. **Get Feedback** - Show to stakeholders, gather requirements
3. **Plan Phase 2** - Prioritize next features
4. **Setup Firebase** - Configure real Firestore for data persistence
5. **Production Build** - Run `npm run build` for deployment

---

## 📖 Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Create production build
npm run preview          # Preview build locally

# Linting (if configured)
npm run lint             # Check code quality
npm run format           # Auto-format code

# Type checking
npx tsc --noEmit         # Check TypeScript without compiling
```

---

**Happy Coding! 🎉**

For questions, see:

- GIFTS_BILLING_README.md (Full documentation)
- QUICK_REFERENCE.md (User guide)
- Individual component files (JSDoc comments)
