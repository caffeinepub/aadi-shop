import { ShoppingBag } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetCart } from '../hooks/useCart';

export default function CartIcon() {
  const navigate = useNavigate();
  const { data: cartItems = [] } = useGetCart();

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={() => navigate({ to: '/cart' })}
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
