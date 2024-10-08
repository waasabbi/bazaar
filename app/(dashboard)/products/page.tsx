'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"

// Define the ProductType interface
interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  expense: number;
  media: string[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductType[]>('/api/products'); // Assuming this is your API endpoint
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading2-bold">Products</h1>
        <Button onClick={handleAddNewProduct}>Add New Product</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-lg">
            <Image 
              src={product.media[0]} // Assuming media is an array of image URLs
              alt={product.title}
              className="w-full h-40 object-cover mb-4"
              width={160}
              height={160}
            />
            <h2 className="text-lg font-bold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-800 font-semibold">Price: ${product.price}</p>
            <p className="text-gray-600">Expense: ${product.expense}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;