'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Grid, List, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import Image from 'next/image';
// import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductType {
  _id: string;
  name: string;
  description: string;
  media: string[];
  price: number;
}

export default function Products() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.categoryId as string;
  const collectionId = params.collectionId as string;
  const collectionTitle = searchParams.get('collectionTitle') || 'Collection';
  const categoryTitle = searchParams.get('categoryTitle') || 'Category';

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      if (!categoryId || !collectionId) {
        console.error("categoryId or collectionId is undefined");
        return;
      }

      const res = await fetch(`/api/collections/${collectionId}/categories/${categoryId}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('[products_GET]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, collectionId]);

  const handleAddProduct = () => {
    router.push(`/collections/${collectionId}/categories/${categoryId}/products/new?collectionTitle=${encodeURIComponent(collectionTitle)}&categoryTitle=${encodeURIComponent(categoryTitle)}`);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/categories/${categoryId}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');

      fetchProducts();
    } catch (err) {
      console.error('[product_DELETE]', err);
    }
  };

  const handleProductClick = (product: ProductType) => {
    router.push(`/collections/${collectionId}/categories/${categoryId}/products/${product._id}?collectionTitle=${encodeURIComponent(collectionTitle)}&categoryTitle=${encodeURIComponent(categoryTitle)}&productTitle=${encodeURIComponent(product.name)}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbItems = [
    { name: "Collections", href: "/collections" },
    { name: collectionTitle, href: `/collections/${collectionId}` },
    { name: categoryTitle, href: `/collections/${collectionId}/categories/${categoryId}` },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold">{categoryTitle}</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-4">
          <ToggleGroup type="single" value={view} onValueChange={(value) => setView(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={product.media[0] || '/placeholder.svg?height=300&width=400'}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <p className="text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-semibold mb-4">${product.price.toFixed(2)}</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleProductClick(product)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-10 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center p-4">
                <Image
                  src={product.media[0] || '/placeholder.svg?height=100&width=100'}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mr-4"
                />
                <div className="flex-grow">
                  <CardTitle className="mb-2">{product.name}</CardTitle>
                  <p className="text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                  <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleProductClick(product)}>
                    View Details
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-10 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white p-6 rounded-md shadow-lg">
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}