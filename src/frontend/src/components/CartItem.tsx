import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CartItem as CartItemType, Product } from '../backend';
import { useRemoveFromCart, useAddToCart } from '../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  product: Product | null;
}

export default function CartItem({ item, product }: CartItemProps) {
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();

  if (!product) return null;

  const subtotal = Number(product.price) * Number(item.quantity);

  const handleRemove = () => {
    removeFromCart.mutate({ productId: item.productId, size: item.size });
  };

  const handleIncrement = () => {
    addToCart.mutate({
      productId: item.productId,
      size: item.size,
      quantity: BigInt(1),
    });
  };

  const handleDecrement = () => {
    if (Number(item.quantity) > 1) {
      removeFromCart.mutate({ productId: item.productId, size: item.size });
      addToCart.mutate({
        productId: item.productId,
        size: item.size,
        quantity: BigInt(Number(item.quantity) - 1),
      });
    } else {
      handleRemove();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={`/assets/generated/${product.image}`}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: <Badge variant="outline">{item.size}</Badge>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={removeFromCart.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDecrement}
                  disabled={removeFromCart.isPending || addToCart.isPending}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{Number(item.quantity)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
                  disabled={addToCart.isPending}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
