import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCart } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { usePlaceOrder } from '../hooks/useOrders';
import type { CustomerInfo } from '../backend';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems = [] } = useGetCart();
  const { data: allProducts = [] } = useGetAllProducts();
  const placeOrder = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfo>();

  const cartWithProducts = cartItems.map((item) => ({
    item,
    product: allProducts.find((p) => p.id === item.productId) || null,
  }));

  const total = cartWithProducts.reduce((sum, { item, product }) => {
    if (!product) return sum;
    return sum + Number(product.price) * Number(item.quantity);
  }, 0);

  const onSubmit = (data: CustomerInfo) => {
    placeOrder.mutate(data, {
      onSuccess: (orderId) => {
        toast.success('Order placed successfully!');
        navigate({ to: '/order-confirmation', search: { orderId: orderId.toString() } });
      },
      onError: (error) => {
        toast.error('Failed to place order. Please try again.');
        console.error(error);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button onClick={() => navigate({ to: '/products' })}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate({ to: '/cart' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address *</Label>
                  <Input
                    id="shippingAddress"
                    {...register('shippingAddress', {
                      required: 'Shipping address is required',
                    })}
                  />
                  {errors.shippingAddress && (
                    <p className="text-sm text-destructive">
                      {errors.shippingAddress.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={placeOrder.isPending}
                >
                  {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartWithProducts.map(({ item, product }) => {
                  if (!product) return null;
                  return (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {product.name} ({item.size}) x {Number(item.quantity)}
                      </span>
                      <span className="font-medium">
                        ${(Number(product.price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
