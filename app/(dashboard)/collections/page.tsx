"use client";

import { useEffect, useState } from "react";
import { CollectionType } from "@/lib/types";  // Import CollectionType from lib/types

const Collections = () => {
  // Use CollectionType for the state
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data: CollectionType[] = await res.json(); 
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <div key={collection._id} className="border rounded-lg p-4 shadow-lg">
            <img 
              src={collection.image} 
              alt={collection.title} 
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h2 className="text-xl font-bold mb-2">{collection.title}</h2>
            <p className="text-gray-600 mb-4">{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
