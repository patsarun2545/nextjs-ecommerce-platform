import ProductList from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/db/products";
import { Badge } from "@/components/ui/badge";

export default async function ProductAdminPage() {
  const products = await getProducts();

  const activeCount = products.filter((p) => p.status === "Active").length;
  const inactiveCount = products.filter((p) => p.status === "Inactive").length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStock).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Product Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your product inventory and details
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-blue-600">{products.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-green-600">{activeCount}</span>
            Active
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-gray-500">{inactiveCount}</span>
            Inactive
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <span className="font-semibold text-amber-600">{lowStockCount}</span>
            Low Stock
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Product List */}
        <div className="lg:col-span-3">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
};