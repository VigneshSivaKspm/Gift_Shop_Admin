import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react";
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
import { getAllCustomers } from "../../services/firestore-service";
import { toast } from "sonner";

export function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const allCustomers = await getAllCustomers();

      // Enrich customer data
      const customersData = allCustomers.map((customer) => {
        return {
          ...customer,
          fullName:
            customer.name ||
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        };
      });

      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "all", label: "All Customers" },
    { value: "customer", label: "Retail Customers" },
    { value: "reseller", label: "Resellers" },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      (customer.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (customer.phone || "").includes(searchQuery);
    const matchesRole = filterRole === "all" || customer.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      title: "Total Customers",
      value: customers.filter((c) => c.role === "customer").length,
      icon: <UserIcon size={24} />,
      color: "bg-[#2563EB]",
    },
    {
      title: "Total Resellers",
      value: customers.filter((c) => c.role === "reseller").length,
      icon: <Award size={24} />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Profile Complete",
      value: customers.filter((c) => c.profileComplete).length,
      icon: <CheckCircle size={24} />,
      color: "bg-[#10b981]",
    },
    {
      title: "Incomplete Profiles",
      value: customers.filter((c) => !c.profileComplete).length,
      icon: <AlertCircle size={24} />,
      color: "bg-[#ef4444]",
    },
  ];

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
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#0f1419]">
          Customer Management
        </h2>
        <p className="text-xs md:text-sm text-[#64748b] mt-1">
          Manage customers and resellers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover className="p-3 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className={`${stat.color} text-white p-2 md:p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-[#0f1419] mb-1 line-clamp-1">
              {stat.value}
            </h3>
            <p className="text-xs md:text-sm text-[#64748b]">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers..."
          />
          <Select
            options={roleOptions}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          />
        </div>
      </Card>

      {/* Customers Table - Responsive wrapper */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[180px]">
                  Email
                </TableHead>
                <TableHead className="hidden sm:table-cell min-w-[120px]">
                  Phone
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[130px]">
                  Date of Birth
                </TableHead>
                <TableHead className="hidden lg:table-cell min-w-[150px]">
                  Address
                </TableHead>
                <TableHead className="min-w-[110px]">Role</TableHead>
                <TableHead className="hidden md:table-cell min-w-[110px]">
                  Profile Complete
                </TableHead>
                <TableHead className="hidden sm:table-cell min-w-[110px]">
                  Updated
                </TableHead>
                <TableHead className="min-w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-slate-500">
                      {customers.length === 0
                        ? "No customers found"
                        : "No matching customers"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 bg-[#0066cc] rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0">
                          {(customer.name || customer.firstName || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-xs md:text-sm line-clamp-2 block">
                            {customer.name ||
                              `${customer.firstName || ""} ${customer.lastName || ""}`.trim()}
                          </span>
                          <span className="text-xs text-[#64748b]">
                            {customer.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-xs md:text-sm line-clamp-1 break-all">
                        {customer.email || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-xs md:text-sm">
                        {customer.phone || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-xs md:text-sm">
                        {customer.dateOfBirth
                          ? new Date(customer.dateOfBirth).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs md:text-sm">
                        {customer.addresses && customer.addresses.length > 0 ? (
                          <div>
                            <p className="font-medium line-clamp-1">
                              {customer.addresses[0].addressLine1}
                            </p>
                            <p className="text-[#64748b] text-xs">
                              {customer.addresses[0].city},{" "}
                              {customer.addresses[0].state}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[#64748b]">No address</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.role === "reseller" ? "warning" : "info"
                        }
                        className="text-xs"
                      >
                        {customer.role === "reseller" ? "Reseller" : "Customer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">
                      <Badge
                        variant={
                          customer.profileComplete ? "success" : "secondary"
                        }
                        className="text-xs"
                      >
                        {customer.profileComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs md:text-sm">
                      {customer.updatedAt
                        ? new Date(customer.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            },
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <button className="text-[#1e40af] hover:underline text-xs md:text-sm font-medium">
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
