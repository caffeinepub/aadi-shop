import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { orderId?: string };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Thank you for your order. We've received your order and will process it shortly.
            </p>

            {search.orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-2xl font-bold">#{search.orderId}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order details.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => navigate({ to: '/products' })}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
