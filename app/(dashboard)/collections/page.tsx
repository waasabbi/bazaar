'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CollectionType } from "@/lib/types";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Collections() {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", { method: "GET" });
      if (!res.ok) throw new Error('Failed to fetch collections');
      const data: CollectionType[] = await res.json();
      setCollections(data);
    } catch (err) {
      console.error("[collections_GET]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const handleCollectionClick = (collection: CollectionType) => {
    router.push(`/collections/${collection._id}?title=${encodeURIComponent(collection.title)}`);
  };

  const handleAddCollection = () => {
    router.push("/collections/new");
  };

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const breadcrumbItems = [
    { name: "Collections", href: "/collections" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold">Collections</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-4">
          <ToggleGroup type="single" value={view} onValueChange={(value) => setView(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={handleAddCollection}>
            <Plus className="mr-2 h-4 w-4" /> Add Collection
          </Button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections.map((collection) => (
            <Card key={collection._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2">{collection.title}</CardTitle>
                <p className="text-muted-foreground mb-4 line-clamp-2">{collection.description}</p>
                <Button onClick={() => handleCollectionClick(collection)} className="w-full">
                  View Categories
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCollections.map((collection) => (
            <Card key={collection._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center p-4">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mr-4"
                />
                <div className="flex-grow">
                  <CardTitle className="mb-2">{collection.title}</CardTitle>
                  <p className="text-muted-foreground mb-2 line-clamp-1">{collection.description}</p>
                </div>
                <Button onClick={() => handleCollectionClick(collection)}>
                  View Categories
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}