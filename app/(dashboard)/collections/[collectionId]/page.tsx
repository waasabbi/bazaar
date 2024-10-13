'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryType {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function Categories() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const collectionId = params.collectionId as string;
  const collectionTitle = searchParams.get('title') || 'Collection';

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/categories`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('[categories_GET]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [collectionId]);

  const handleAddCategory = () => {
    router.push(`/collections/${collectionId}/categories/new?collectionTitle=${encodeURIComponent(collectionTitle)}`);
  };

  const handleCategoryClick = (category: CategoryType) => {
    router.push(`/collections/${collectionId}/categories/${category._id}?collectionTitle=${encodeURIComponent(collectionTitle)}&categoryTitle=${encodeURIComponent(category.title)}`);
  };

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbItems = [
    { name: "Collections", href: "/collections" },
    { name: collectionTitle, href: `/collections/${collectionId}` }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold">{collectionTitle}</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories..."
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
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <Card key={category._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={category.image || '/placeholder.svg?height=300&width=400'}
                  alt={category.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">{category.title}</CardTitle>
                <p className="text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
                <Button onClick={() => handleCategoryClick(category)} className="w-full">
                  View Products
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center p-4">
                <Image
                  src={category.image || '/placeholder.svg?height=100&width=100'}
                  alt={category.title}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mr-4"
                />
                <div className="flex-grow">
                  <CardTitle className="mb-2">{category.title}</CardTitle>
                  <p className="text-muted-foreground mb-2 line-clamp-1">{category.description}</p>
                </div>
                <Button onClick={() => handleCategoryClick(category)}>
                  View Products
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}