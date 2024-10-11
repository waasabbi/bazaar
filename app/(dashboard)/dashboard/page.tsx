'use client'

import React, { useEffect, useState } from 'react'
import { Bell, ChevronDown, Home, Package, ShoppingCart, Users, Calendar, Mail, LogOut, Search, Moon, Plus, Edit, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface CollectionType {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
  categories: CategoryType[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  media: string[];
  category: string;
  collections: CollectionType[];
  tags: string[];
  sizes: string[];
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryType {
  _id: string;
  title: string;
  collection: CollectionType[];
  products: ProductType[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data: CollectionType[] = await res.json(); 
      setCollections(data);
    } catch (err) {
      console.log("[collections_GET]", err);
      setError('Failed to fetch collections');
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get<ProductType[]>('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.log("[products_GET]", err);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    Promise.all([getCollections(), getProducts()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  const filteredProducts = selectedCollection
    ? products.filter(product => product.collections.some(col => col._id === selectedCollection._id))
    : products;

  const furtherFilteredProducts = selectedCategory
    ? filteredProducts.filter(product => product.category === selectedCategory)
    : filteredProducts;

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm w-96">
                <Input type="text" placeholder="Search" className="pl-10" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon">
                <Moon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="ml-3">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>ZF</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedCollection ? (selectedCategory ? `Category: ${selectedCategory}` : selectedCollection.title) : 'All Products'}
              </h2>
              <Button onClick={handleAddNewProduct}>
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </div>
            {selectedCollection && (
              <div className="mb-4">
                <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {selectedCollection.categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {furtherFilteredProducts.map((product) => (
                <Card key={product._id}>
                  <CardContent className="p-4">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                      <Image
                        src={product.media && product.media.length > 0 ? product.media[0] : '/placeholder.svg'}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                    <Button className="mt-4 w-full" variant="outline">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <div
                  key={collection._id}
                  className={`border rounded-lg p-4 shadow-lg cursor-pointer ${
                    selectedCollection?._id === collection._id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedCollection(collection);
                    setSelectedCategory(null);
                  }}
                >
                  <Image 
                    src={collection.image} 
                    alt={collection.title} 
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{collection.title}</h2>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                </div>
              ))}
              <div
                className="border rounded-lg p-4 shadow-lg cursor-pointer flex flex-col items-center justify-center"
                onClick={() => {
                  setSelectedCollection(null);
                  setSelectedCategory(null);
                }}
              >
                <Plus className="h-6 w-6 text-gray-500" />
                <span className="mt-2 text-gray-500">Show All</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products List</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900">ID</TableHead>
                  <TableHead className="text-gray-900">Product Name</TableHead>
                  <TableHead className="text-gray-900">Price</TableHead>
                  <TableHead className="text-gray-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {furtherFilteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="text-gray-700">{product._id}</TableCell>
                    <TableCell className="text-gray-700">{product.title}</TableCell>
                    <TableCell className="text-gray-700">${product.price}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}