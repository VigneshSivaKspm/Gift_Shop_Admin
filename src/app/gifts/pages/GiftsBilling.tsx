// Main Gifts Billing Page - MVP
import React, { useState, useEffect } from "react";
import { Bill, PaymentDetails, Customer } from "../types";
import { useBillCalculations } from "../hooks/useBillCalculations";
import { useProductInventory } from "../hooks/useProductInventory";
import { useCustomerSearch } from "../hooks/useCustomerSearch";
import { generateBillNumber, formatDate } from "../utils/calculations";
import {
  generateInvoicePDF,
  downloadInvoice,
  printInvoice,
} from "../services/pdfGeneratorService";
import {
  saveBillToFirestore,
  uploadBillPDFToStorage,
  saveCustomerToFirestore,
} from "../services/giftsFirestoreService";
import { validateBill } from "../utils/validations";
import { ProductListItem } from "../components/ProductListItem";
import { BillSummary } from "../components/BillSummary";
import { CustomerSearch } from "../components/CustomerSearch";
import { PaymentModal } from "../components/PaymentModal";
import { InvoicePreview } from "../components/InvoicePreview";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Plus, RotateCcw, Download, Eye, Loader } from "lucide-react";

export const GiftsBillingPage: React.FC = () => {
  // ===== STATE MANAGEMENT =====
  const [billId, setBillId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ===== CUSTOM HOOKS =====
  const {
    items,
    appliedDiscounts,
    calculations,
    addItem,
    removeItem,
    updateItemQuantity,
    clearItems,
    addDiscount,
    removeDiscount,
  } = useBillCalculations();

  const {
    products,
    filteredProducts,
    loading: productsLoading,
    filterProducts,
    getProductById,
    getCategories,
  } = useProductInventory();

  const {
    searchResults,
    selectedCustomer,
    loading: customerLoading,
    error: customerError,
    searchByPhone,
    searchByName,
    selectCustomer,
    createNewCustomer,
  } = useCustomerSearch();

  // ===== HANDLERS =====
  const handleAddToCart = (product: any, quantity: number) => {
    if (product.stock < quantity) {
      setErrorMessage(`Only ${product.stock} units available`);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    addItem(product.id, product.name, quantity, product.price, product.taxRate);

    setSuccessMessage(`${product.name} added to bill`);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleCreateNewCustomer = () => {
    selectCustomer({
      id: `cust-${Date.now()}`,
      phone: "",
      firstName: "",
      totalPurchases: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Customer);
  };

  const handleClearBill = () => {
    if (items.length > 0 && !confirm("Clear all items from bill?")) {
      return;
    }
    clearItems();
    setErrorMessage("");
  };

  const handlePaymentComplete = async (
    payments: PaymentDetails[],
    totalPaid: number,
  ) => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Validate bill
      const billErrors = validateBill({
        items,
        billDate: new Date(),
        totalAmount: calculations.total,
      });

      if (billErrors.length > 0) {
        setErrorMessage(billErrors[0]);
        setIsProcessing(false);
        return;
      }

      // Create bill object
      const newBill: Bill = {
        id: billId || `bill-${Date.now()}`,
        billNumber: generateBillNumber(),
        customerId: selectedCustomer?.id,
        customerDetails: selectedCustomer
          ? {
              name: `${selectedCustomer.firstName} ${selectedCustomer.lastName || ""}`.trim(),
              phone: selectedCustomer.phone,
              email: selectedCustomer.email,
            }
          : undefined,
        items,
        subtotal: calculations.subtotal,
        discounts: appliedDiscounts,
        totalDiscount: calculations.totalDiscount,
        taxAmount: calculations.totalTax,
        totalAmount: calculations.total,
        balanceDue: Math.max(0, calculations.total - totalPaid),
        paymentStatus:
          totalPaid >= calculations.total
            ? "paid"
            : totalPaid > 0
              ? "partial"
              : "pending",
        paymentDetails: payments,
        billDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save bill to Firestore
      const savedBillId = await saveBillToFirestore(newBill);
      newBill.id = savedBillId;

      // Save customer if new
      if (
        selectedCustomer &&
        !selectedCustomer.id.startsWith("cust-") === false
      ) {
        await saveCustomerToFirestore({
          ...selectedCustomer,
          totalPurchases: (selectedCustomer.totalPurchases || 0) + 1,
          totalSpent: (selectedCustomer.totalSpent || 0) + newBill.totalAmount,
          lastPurchaseDate: new Date(),
        });
      }

      // Generate and upload PDF
      try {
        const pdfBlob = generateInvoicePDF(newBill);
        const pdfUrl = await uploadBillPDFToStorage(savedBillId, pdfBlob);
        newBill.pdfUrl = pdfUrl;
      } catch (pdfError) {
        console.error("PDF upload failed:", pdfError);
        // Continue without PDF URL - not critical for UV
      }

      setCompletedBill(newBill);
      setShowPaymentModal(false);
      setShowInvoicePreview(true);
      setSuccessMessage("Bill created successfully!");

      // Clear bill for next transaction
      setTimeout(() => {
        clearItems();
        selectCustomer(null as any);
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to process payment",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = (bill: Bill) => {
    downloadInvoice(bill);
    setSuccessMessage("Invoice downloaded");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handlePrintInvoice = (bill: Bill) => {
    printInvoice(bill);
  };

  // ===== FILTER PRODUCTS =====
  useEffect(() => {
    filterProducts({
      category: categoryFilter || undefined,
      searchTerm: searchTerm || undefined,
      inStockOnly: true,
    });
  }, [categoryFilter, searchTerm, filterProducts]);

  const categories = getCategories();
  const isReadyForPayment = items.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1a2332]">
            Gifts Billing System
          </h2>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Quick billing & invoicing for gift sales
          </p>
        </div>
        <Badge className="bg-primary text-white text-sm py-2 px-4">
          {formatDate(new Date())}
        </Badge>
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert className="mb-4 bg-emerald-50 border-emerald-200">
          <AlertDescription className="text-emerald-700">
            ✓ {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            ✗ {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Products and Bill */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <CustomerSearch
            searchResults={searchResults}
            selectedCustomer={selectedCustomer}
            loading={customerLoading}
            error={customerError}
            onSearch={(query, type) =>
              type === "phone" ? searchByPhone(query) : searchByName(query)
            }
            onSelectCustomer={selectCustomer}
            onCreateNewCustomer={handleCreateNewCustomer}
          />

          {/* Products Section */}
          <Card className="overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border/50">
              <h3 className="font-bold text-lg text-[#1a2332]">
                Select Products
              </h3>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {/* Filters */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={categoryFilter === "" ? "primary" : "outline"}
                    onClick={() => setCategoryFilter("")}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={
                        categoryFilter === category ? "primary" : "outline"
                      }
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Products List */}
              {productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#64748b]">No products found</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isDisabled={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - Bill Summary */}
        <div className="space-y-4">
          <BillSummary
            items={items}
            calculations={calculations}
            appliedDiscounts={appliedDiscounts}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateItemQuantity}
            onRemoveDiscount={removeDiscount}
            isReadOnly={false}
          />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => setShowInvoicePreview(true)}
              disabled={!isReadyForPayment}
              variant="primary"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Bill
            </Button>

            <Button
              onClick={() => setShowPaymentModal(true)}
              disabled={!isReadyForPayment || isProcessing}
              variant="primary"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <Button
              onClick={handleClearBill}
              disabled={items.length === 0}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Bill
            </Button>
          </div>

          {/* Quick Info */}
          {items.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Tip:</span> Preview the bill to
                verify details before payment
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        calculations={calculations}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
      />

      {completedBill && (
        <InvoicePreview
          isOpen={showInvoicePreview}
          bill={completedBill}
          onClose={() => {
            setShowInvoicePreview(false);
            setCompletedBill(null);
          }}
          onDownload={handleDownloadInvoice}
          onPrint={handlePrintInvoice}
        />
      )}
    </div>
  );
};
