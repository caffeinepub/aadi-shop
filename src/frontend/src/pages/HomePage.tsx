import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ProductCard from '../components/ProductCard';
import { useGetAllProducts } from '../hooks/useProducts';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useGetAllProducts();

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="Aadi Shop Collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Elevate Your Style
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover premium clothing that combines comfort, quality, and timeless design.
                Shop the latest collection from Aadi Shop.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/products' })}>
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/products' })}>
                  View Collections
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked selections from our latest collection. Quality craftsmanship meets modern design.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/products' })}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find the perfect style for everyone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Men', category: 'Men', image: 'product-mens-tshirt.dim_800x800.png' },
              { name: 'Women', category: 'Women', image: 'product-womens-dress.dim_800x800.png' },
              { name: 'Kids', category: 'Kids', image: 'product-kids-outfit.dim_800x800.png' },
            ].map((cat) => (
              <div
                key={cat.category}
                className="group relative h-80 overflow-hidden rounded-lg cursor-pointer"
                onClick={() => navigate({ to: '/products', search: { category: cat.category } })}
              >
                <img
                  src={`/assets/generated/${cat.image}`}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                    <Button variant="secondary">
                      Shop {cat.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
