import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: bigint) => {
    return `$${Number(price).toFixed(2)}`;
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer">
      <div
        onClick={() => navigate({ to: `/products/${product.id}` })}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={`/assets/generated/${product.image}`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 right-3">{product.category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <p className="text-xl font-bold">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => navigate({ to: `/products/${product.id}` })}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
