import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductTable from '../components/AdminProductTable';
import AdminOrdersList from '../components/AdminOrdersList';
import { useGetAllProducts } from '../hooks/useProducts';
import { useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { useGetOrders } from '../hooks/useOrders';
import type { Product } from '../backend';
import { toast } from 'sonner';

function AdminPageContent() {
  const { data: products = [] } = useGetAllProducts();
  const { data: orders = [] } = useGetOrders();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct.mutate(productData as Product, {
        onSuccess: () => {
          toast.success('Product updated successfully');
          setIsFormOpen(false);
          setEditingProduct(null);
        },
        onError: () => {
          toast.error('Failed to update product');
        },
      });
    } else {
      addProduct.mutate(productData as Product, {
        onSuccess: () => {
          toast.success('Product added successfully');
          setIsFormOpen(false);
        },
        onError: () => {
          toast.error('Failed to add product');
        },
      });
    }
  };

  const handleDeleteProduct = (productId: bigint) => {
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        toast.success('Product deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete product');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your products and orders</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Product Management</h2>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <AdminProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isDeleting={deleteProduct.isPending}
          />
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrdersList orders={orders} />
        </TabsContent>
      </Tabs>

      <AdminProductForm
        product={editingProduct}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={addProduct.isPending || updateProduct.isPending}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
