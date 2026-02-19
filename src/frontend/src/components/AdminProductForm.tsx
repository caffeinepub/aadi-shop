import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product, Category, Size } from '../backend';
import { Category as CategoryEnum, Size as SizeEnum } from '../backend';

interface AdminProductFormProps {
  product?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Partial<Product>) => void;
  isSubmitting: boolean;
}

const availableImages = [
  'product-mens-tshirt.dim_800x800.png',
  'product-womens-dress.dim_800x800.png',
  'product-kids-outfit.dim_800x800.png',
];

const allSizes = [SizeEnum.XS, SizeEnum.S, SizeEnum.M, SizeEnum.L, SizeEnum.XL, SizeEnum.XXL];

export default function AdminProductForm({
  product,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AdminProductFormProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);

  const watchCategory = watch('category');
  const watchImage = watch('image');

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', Number(product.price));
      setValue('category', product.category);
      setValue('image', product.image);
      setSelectedSizes(product.sizes);
    } else {
      reset();
      setSelectedSizes([]);
    }
  }, [product, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    const productData: Partial<Product> = {
      ...(product && { id: product.id }),
      name: data.name,
      description: data.description,
      price: BigInt(Math.round(parseFloat(data.price) * 100) / 100),
      category: data.category as Category,
      sizes: selectedSizes,
      image: data.image,
    };
    onSubmit(productData);
  };

  const toggleSize = (size: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product information' : 'Create a new product in your catalog'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description', { required: true })} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watchCategory}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CategoryEnum.Men}>Men</SelectItem>
                  <SelectItem value={CategoryEnum.Women}>Women</SelectItem>
                  <SelectItem value={CategoryEnum.Kids}>Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={size}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => toggleSize(size)}
                  />
                  <Label htmlFor={size} className="cursor-pointer">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Select value={watchImage} onValueChange={(value) => setValue('image', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select image" />
              </SelectTrigger>
              <SelectContent>
                {availableImages.map((img) => (
                  <SelectItem key={img} value={img}>
                    {img}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {watchImage && (
              <div className="mt-2">
                <img
                  src={`/assets/generated/${watchImage}`}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
