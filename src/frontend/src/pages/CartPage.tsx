import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CartItem from '../components/CartItem';
import { useGetCart } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems = [], isLoading: isLoadingCart } = useGetCart();
  const { data: allProducts = [] } = useGetAllProducts();

  const cartWithProducts = cartItems.map((item) => ({
    item,
    product: allProducts.find((p) => p.id === item.productId) || null,
  }));

  const total = cartWithProducts.reduce((sum, { item, product }) => {
    if (!product) return sum;
    return sum + Number(product.price) * Number(item.quantity);
  }, 0);

  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <img
            src="/assets/generated/empty-cart.dim_300x300.png"
            alt="Empty Cart"
            className="mx-auto h-48 w-48"
          />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/products' })}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map(({ item, product }) => (
            <CartItem
              key={`${item.productId}-${item.size}`}
              item={item}
              product={product}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
