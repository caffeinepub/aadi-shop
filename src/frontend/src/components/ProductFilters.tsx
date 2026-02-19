import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Category } from '../backend';

interface ProductFiltersProps {
  selectedCategories: Category[];
  onCategoryChange: (category: Category, checked: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
  productCounts: Record<Category, number>;
}

export default function ProductFilters({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onClearFilters,
  productCounts,
}: ProductFiltersProps) {
  const categories = [Category.Men, Category.Women, Category.Kids];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Category</h3>
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) =>
                onCategoryChange(category, checked as boolean)
              }
            />
            <Label
              htmlFor={category}
              className="text-sm font-normal cursor-pointer flex-1"
            >
              {category} ({productCounts[category] || 0})
            </Label>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
