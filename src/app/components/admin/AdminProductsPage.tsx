import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader2, Upload } from "lucide-react";
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
import { Modal } from "../ui/Modal";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { SearchBar } from "../ui/SearchBar";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useApp } from "../../context/AppContext";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../services/admin-service";
import { toast } from "sonner";

export function AdminProductsPage() {
  const { products, categories: fetchedCategories, loadCategories } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    retailPrice: "",
    resellerPrice: "",
    sellingPrice: "",
    discountPrice: "",
    costPrice: "",
    onOffer: false,
    stock: "",
    sku: "",
    description: "",
    needsCustomerName: false,
    needsCustomerPhoto: false,
    multipleImagesRequired: false,
    numberOfImagesRequired: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = fetchedCategories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  useEffect(() => {
    if (isAddModalOpen && !formData.category && categories.length > 0) {
      setFormData((prev) => ({ ...prev, category: categories[0].value }));
    }
  }, [categories, isAddModalOpen, formData.category]);

  const filteredProducts = (products || []).filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      category: categories.length > 0 ? categories[0].value : "",
      retailPrice: "",
      resellerPrice: "",
      sellingPrice: "",
      discountPrice: "",
      costPrice: "",
      onOffer: false,
      stock: "",
      sku: "",
      description: "",
      needsCustomerName: false,
      needsCustomerPhoto: false,
      multipleImagesRequired: false,
      numberOfImagesRequired: "",
    });
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setFormData({
      name: product.name,
      category: product.category,
      retailPrice: product.retailPrice.toString(),
      resellerPrice: product.resellerPrice.toString(),
      sellingPrice: (product.sellingPrice || "").toString(),
      discountPrice: (product.discountPrice || "").toString(),
      costPrice: (product.costPrice || "").toString(),
      onOffer: product.onOffer || false,
      stock: product.stock.toString(),
      sku: product.sku,
      description: product.description,
      needsCustomerName: product.needsCustomerName || false,
      needsCustomerPhoto: product.needsCustomerPhoto || false,
      multipleImagesRequired: product.multipleImagesRequired || false,
      numberOfImagesRequired: (product.numberOfImagesRequired || "").toString(),
    });
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product.image);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      setIsSaving(true);
      const productData = {
        name: formData.name,
        category: formData.category,
        retailPrice: parseFloat(formData.retailPrice),
        resellerPrice: parseFloat(formData.resellerPrice),
        sellingPrice: formData.sellingPrice
          ? parseFloat(formData.sellingPrice)
          : parseFloat(formData.retailPrice),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : parseFloat(formData.retailPrice),
        costPrice: parseFloat(formData.costPrice || "0"),
        onOffer: formData.onOffer,
        stock: parseInt(formData.stock),
        sku: formData.sku,
        description: formData.description,
        needsCustomerName: formData.needsCustomerName,
        needsCustomerPhoto: formData.needsCustomerPhoto,
        multipleImagesRequired: formData.multipleImagesRequired,
        numberOfImagesRequired: formData.multipleImagesRequired
          ? parseInt(formData.numberOfImagesRequired || "0")
          : 0,
        image: editingProduct?.image || "",
        tags: editingProduct?.tags || [],
        rating: editingProduct?.rating || 0,
        reviews: editingProduct?.reviews || 0,
      };

      if (editingProduct) {
        await adminUpdateProduct(
          editingProduct.id,
          productData,
          imageFile || undefined,
        );
        toast.success("Product updated successfully");
      } else {
        if (!imageFile && !productData.image) {
          toast.error("Please upload a product image");
          setIsSaving(false);
          return;
        }
        await adminCreateProduct(productData, imageFile || undefined);
        toast.success("Product added successfully");
      }

      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminDeleteProduct(productId);
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-[#1a2332]">
            Product Management
          </h2>
          <p className="text-xs md:text-sm text-[#64748b] mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
            />
          </div>
          <Select
            options={[{ value: "all", label: "All Categories" }, ...categories]}
            className="w-full sm:w-64"
          />
        </div>
      </Card>

      {/* Products Table - Responsive wrapper */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Product</TableHead>
                <TableHead className="min-w-[80px]">SKU</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[100px]">
                  Category
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">
                  Retail
                </TableHead>
                <TableHead className="hidden lg:table-cell min-w-[100px]">
                  Reseller
                </TableHead>
                <TableHead className="hidden xl:table-cell min-w-[100px]">
                  Cost
                </TableHead>
                <TableHead className="min-w-[60px]">Stock</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[90px]">
                  Offer
                </TableHead>
                <TableHead className="min-w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <span className="font-medium text-xs sm:text-sm line-clamp-2">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    {product.category}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                    ₹{product.retailPrice}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                    ₹{product.resellerPrice}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-xs sm:text-sm text-[#64748b]">
                    ₹{product.costPrice || 0}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm font-medium">
                    {product.stock}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={product.onOffer ? "warning" : "default"}
                      className="text-xs"
                    >
                      {product.onOffer ? "ON OFFER" : "NORMAL"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1.5 sm:p-2 hover:bg-[#eff6ff] text-[#1e40af] rounded-lg transition-colors flex-shrink-0"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 sm:p-2 hover:bg-[#fef2f2] text-[#dc2626] rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="2xl"
        footer={
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProduct}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder=""
              required
            />
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder=""
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-medium text-[#111827]">
                Product Category
              </label>
              {categories.length === 0 && (
                <span className="text-xs text-red-500 font-medium">
                  No categories found! Add one first.
                </span>
              )}
            </div>
            <Select
              options={
                categories.length > 0
                  ? categories
                  : [{ value: "", label: "No Categories Available" }]
              }
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={
                categories.length === 0 ? "border-red-200 bg-red-50" : ""
              }
            />
          </div>

          <div className="space-y-3 border-t border-b border-[#E5E7EB] py-4">
            <h3 className="text-sm font-semibold text-[#111827]">
              Product Customization
            </h3>
            <div className="flex items-center space-x-3">
              <input
                id="needsCustomerName"
                type="checkbox"
                checked={formData.needsCustomerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    needsCustomerName: e.target.checked,
                  })
                }
                className="w-5 h-5 cursor-pointer border border-[#E5E7EB] rounded"
              />
              <label
                htmlFor="needsCustomerName"
                className="cursor-pointer text-sm text-[#111827]"
              >
                Requires Customer Name (e.g., personalized gifts)
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                id="needsCustomerPhoto"
                type="checkbox"
                checked={formData.needsCustomerPhoto}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    needsCustomerPhoto: e.target.checked,
                  })
                }
                className="w-5 h-5 cursor-pointer border border-[#E5E7EB] rounded"
              />
              <label
                htmlFor="needsCustomerPhoto"
                className="cursor-pointer text-sm text-[#111827]"
              >
                Requires Customer Photo (e.g., photo products)
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                id="multipleImagesRequired"
                type="checkbox"
                checked={formData.multipleImagesRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    multipleImagesRequired: e.target.checked,
                    numberOfImagesRequired: e.target.checked
                      ? formData.numberOfImagesRequired
                      : "",
                  })
                }
                className="w-5 h-5 cursor-pointer border border-[#E5E7EB] rounded"
              />
              <label
                htmlFor="multipleImagesRequired"
                className="cursor-pointer text-sm text-[#111827]"
              >
                Requires Multiple Customer Images
              </label>
            </div>
            {formData.multipleImagesRequired && (
              <Input
                label="Number of Images Required"
                type="number"
                min="1"
                max="10"
                value={formData.numberOfImagesRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfImagesRequired: e.target.value,
                  })
                }
                placeholder="e.g., 3 or 5"
                required
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Retail Price (₹)"
              type="number"
              value={formData.retailPrice}
              onChange={(e) =>
                setFormData({ ...formData, retailPrice: e.target.value })
              }
              placeholder=""
              required
            />
            <Input
              label="Reseller Price (₹)"
              type="number"
              value={formData.resellerPrice}
              onChange={(e) =>
                setFormData({ ...formData, resellerPrice: e.target.value })
              }
              placeholder=""
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Selling Price (₹)"
              type="number"
              value={formData.sellingPrice}
              onChange={(e) =>
                setFormData({ ...formData, sellingPrice: e.target.value })
              }
              placeholder=""
              required
            />
            <Input
              label="Discount/Offer Price (₹)"
              type="number"
              value={formData.discountPrice}
              onChange={(e) =>
                setFormData({ ...formData, discountPrice: e.target.value })
              }
              placeholder=""
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Cost Price (₹ - for profit calculation)"
              type="number"
              value={formData.costPrice}
              onChange={(e) =>
                setFormData({ ...formData, costPrice: e.target.value })
              }
              placeholder=""
              required
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="onOffer"
              checked={formData.onOffer}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, onOffer: checked })
              }
            />
            <Label htmlFor="onOffer">
              Enable Offer Sale (Show discount price on frontend)
            </Label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              rows={4}
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Product Image
            </label>
            <label
              htmlFor="product-image-input"
              className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-4 text-center hover:border-[#2563EB] transition-colors cursor-pointer overflow-hidden min-h-[150px] flex flex-col items-center justify-center gap-2"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-[200px] rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload size={24} className="text-[#6B7280]" />
                  <p className="text-[#6B7280]">
                    Click to upload image or drag and drop
                  </p>
                  <p className="text-xs text-[#6B7280]">PNG, JPG up to 5MB</p>
                </>
              )}
            </label>
            <input
              id="product-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
