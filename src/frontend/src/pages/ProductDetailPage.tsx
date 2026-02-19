import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProduct } from '../hooks/useProduct';
import { useAddToCart } from '../hooks/useCart';
import { Size } from '../backend';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const productId = BigInt(id as string);
  const { data: product, isLoading } = useGetProduct(productId);
  const addToCart = useAddToCart();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = !!identity;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      await login();
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart.mutate(
      {
        productId,
        size: selectedSize,
        quantity: BigInt(quantity),
      },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
        },
        onError: (error) => {
          toast.error('Failed to add to cart');
          console.error(error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate({ to: '/products' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate({ to: '/products' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={`/assets/generated/${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-3">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
          </div>

          <div className="prose prose-sm">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Size Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className="w-16"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Product Details</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Premium quality materials</li>
              <li>• Comfortable fit for all-day wear</li>
              <li>• Easy care and maintenance</li>
              <li>• Available in multiple sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
