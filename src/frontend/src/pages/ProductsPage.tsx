import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useGetAllProducts } from '../hooks/useProducts';
import { Category } from '../backend';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const search = useSearch({ strict: false }) as { category?: string };
  const { data: allProducts = [], isLoading } = useGetAllProducts();

  const initialCategory = search.category as Category | undefined;
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : []
  );

  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.max(...allProducts.map((p) => Number(p.price)));
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const productCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      [Category.Men]: 0,
      [Category.Women]: 0,
      [Category.Kids]: 0,
    };
    allProducts.forEach((product) => {
      counts[product.category]++;
    });
    return counts;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const priceMatch =
        Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [allProducts, selectedCategories, priceRange]);

  const handleCategoryChange = (category: Category, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
  };

  const filtersComponent = (
    <ProductFilters
      selectedCategories={selectedCategories}
      onCategoryChange={handleCategoryChange}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      maxPrice={maxPrice}
      onClearFilters={handleClearFilters}
      productCounts={productCounts}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {allProducts.length} products
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">{filtersComponent}</div>
        </aside>

        {/* Mobile Filters */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              {filtersComponent}
            </SheetContent>
          </Sheet>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your filters.
              </p>
              <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
