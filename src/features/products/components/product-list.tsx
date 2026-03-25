"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import {
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteProductModal from "./delete-product-modal";
import ProductDetailModal from "./product-detail-modal";
import RestoreProductModal from "./restore-product-modal";

interface ProductListProps {
  products: ProductType[];
}

export default function ProductList({ products }: ProductListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeTab === "active") {
      result = result.filter((p) => p.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((p) => p.status === "Inactive");
    } else if (activeTab === "low-stock") {
      result = result.filter((p) => p.stock <= p.lowStock);
    }
    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [products, activeTab, searchTerm]);

  const handleDeleteClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModal(true);
  };

  const handleRestoreClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsRestoreModal(true);
  };

  const handleDetailClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDetailModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-2 top-2.5 text-muted-foreground"
              />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">
              <div className="col-span-1 hidden sm:block">Image</div>
              <div className="col-span-6 sm:col-span-4">Product Name</div>
              <div className="col-span-2 hidden sm:block">Category</div>
              <div className="col-span-2 hidden sm:block text-right">Price</div>
              <div className="col-span-1 hidden sm:block text-center">Stock</div>
              <div className="col-span-3 sm:col-span-1 text-center">Status</div>
              <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
            </div>
            <ScrollArea className="h-[350px] sm:h-[420px]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-gray-50 transition-colors duration-100 text-sm"
                  >
                    {/* Image */}
                    <div className="col-span-1 hidden sm:block">
                      <Image
                        alt={product.title}
                        src={product.mainImage?.url || "/images/no-product.png"}
                        width={40}
                        height={40}
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-6 sm:col-span-4 truncate pr-2">
                      <div className="font-medium truncate">{product.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.sku || "No SKU"}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 hidden sm:block text-muted-foreground truncate pr-2">
                      {product.category.name}
                    </div>

                    {/* Price */}
                    <div className="col-span-2 hidden sm:block text-right pr-2">
                      <div className="font-medium">{formatPrice(product.price)}</div>
                      {product.basePrice !== product.price && (
                        <div className="text-xs line-through text-muted-foreground">
                          {formatPrice(product.basePrice)}
                        </div>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="col-span-1 hidden sm:block text-center">
                      <span
                        className={cn("text-sm", {
                          "text-amber-500 font-medium": product.stock <= product.lowStock,
                          "text-red-600 font-medium": product.stock <= 0,
                        })}
                      >
                        {product.stock}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-3 sm:col-span-1 text-center">
                      <Badge
                        variant={product.status === "Active" ? "default" : "destructive"}
                        className="px-1 sm:px-2"
                      >
                        {product.status}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 sm:col-span-1 text-right">
                      {/* Mobile */}
                      <div className="flex justify-end gap-1 md:hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => handleDetailClick(product)}
                        >
                          <Eye size={15} />
                        </Button>
                        {product.status === "Active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleRestoreClick(product)}
                          >
                            <RefreshCcw size={15} />
                          </Button>
                        )}
                      </div>

                      {/* Desktop */}
                      <div className="hidden md:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDetailClick(product)}>
                              <Eye size={15} />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <Pencil size={15} />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {product.status === "Active" ? (
                              <DropdownMenuItem onClick={() => handleDeleteClick(product)}>
                                <Trash2 size={15} className="text-destructive" />
                                <span className="text-destructive">Delete</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleRestoreClick(product)}>
                                <RefreshCcw size={15} className="text-green-600" />
                                <span className="text-green-600">Restore</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No products found
                </div>
              )}
            </ScrollArea>
          </div>


        </CardContent>
      </Card>

      <DeleteProductModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        product={selectedProduct}
      />

      <RestoreProductModal
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
        product={selectedProduct}
      />

      <ProductDetailModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  );
}