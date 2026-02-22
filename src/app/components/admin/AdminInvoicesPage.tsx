import React, { useState, useEffect, useContext } from "react";
// @ts-ignore
import { Plus, Download, Eye, Trash2, Edit2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { SearchBar } from "../ui/SearchBar";
import { Select } from "../ui/select";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AppContext } from "../../context/AppContext";
import {
  getAllInvoices,
  getInvoiceStats,
  deleteInvoice,
  getAllProducts,
  getAllUsers,
} from "../../services/firestore-service";
import { Invoice, Product, User } from "../../types";
import { CreateInvoiceForm } from "./invoice/CreateInvoiceForm";
import { InvoiceDetailModal } from "./invoice/InvoiceDetailModal";
import { toast } from "sonner";

export function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [invoicesData, statsData, productsData, customersData] =
        await Promise.all([
          getAllInvoices(),
          getInvoiceStats(),
          getAllProducts(),
          getAllUsers(),
        ]);

      setInvoices(invoicesData);
      setStats(statsData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentStatusOptions = [
    { value: "all", label: "All Payment Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaymentStatus =
      filterPaymentStatus === "all" ||
      invoice.paymentStatus === filterPaymentStatus;
    return matchesSearch && matchesPaymentStatus;
  });

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(invoiceId);
        setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
        toast.success("Invoice deleted successfully");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleInvoiceCreated = () => {
    setShowCreateModal(false);
    loadData();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-[#1a2332]">
            Invoice Management
          </h2>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Create and manage offline sales invoices
          </p>
        </div>
        <Button
          variant="primary"
          className="w-full sm:w-auto"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus width={20} height={20} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card hover className="p-3 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="bg-blue-500 text-white p-2 md:p-3 rounded-lg">
                <span className="text-lg md:text-xl">📊</span>
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-[#0f1419] mb-1">
              {stats.totalInvoices}
            </h3>
            <p className="text-xs md:text-sm text-[#64748b]">Total Invoices</p>
          </Card>

          <Card hover className="p-3 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="bg-green-500 text-white p-2 md:p-3 rounded-lg">
                <span className="text-lg md:text-xl">₹</span>
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-[#0f1419] mb-1">
              ₹{(stats.totalRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-xs md:text-sm text-[#64748b]">Total Revenue</p>
          </Card>

          <Card hover className="p-3 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="bg-emerald-500 text-white p-2 md:p-3 rounded-lg">
                <span className="text-lg md:text-xl">✓</span>
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-[#0f1419] mb-1">
              {stats.paidInvoices}
            </h3>
            <p className="text-xs md:text-sm text-[#64748b]">Paid Invoices</p>
          </Card>

          <Card hover className="p-3 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="bg-amber-500 text-white p-2 md:p-3 rounded-lg">
                <span className="text-lg md:text-xl">⏳</span>
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-[#0f1419] mb-1">
              {stats.pendingInvoices}
            </h3>
            <p className="text-xs md:text-sm text-[#64748b]">Pending Payment</p>
          </Card>
        </div>
      )}

      {/* Search & Filters */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by invoice number or customer..."
          />
          <Select
            options={paymentStatusOptions}
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
          />
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Invoice #</TableHead>
                <TableHead className="min-w-[120px]">Customer</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[60px]">
                  Items
                </TableHead>
                <TableHead className="min-w-[80px]">Total</TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">
                  Payment Status
                </TableHead>
                <TableHead className="hidden lg:table-cell min-w-[100px]">
                  Date
                </TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">
                      No invoices found. Create one to get started!
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-bold">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {invoice.customerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {invoice.items.length}
                    </TableCell>
                    <TableCell className="font-bold">
                      ₹{invoice.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={getPaymentStatusColor(invoice.paymentStatus)}
                      >
                        {invoice.paymentStatus.charAt(0).toUpperCase() +
                          invoice.paymentStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-1 hover:bg-blue-50 rounded"
                          title="View Invoice"
                        >
                          <Eye
                            width={16}
                            height={16}
                            className="text-blue-600"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Delete Invoice"
                        >
                          <Trash2
                            width={16}
                            height={16}
                            className="text-red-600"
                          />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Invoice"
        size="lg"
      >
        <CreateInvoiceForm
          products={products}
          customers={customers}
          onSuccess={handleInvoiceCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          isOpen={showDetailModal}
          invoice={selectedInvoice}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
