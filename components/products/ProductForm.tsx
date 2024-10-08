'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import ImageUpload from "../custom ui/ImageUpload"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { ProductType, CollectionType } from "@/lib/types"
import Select from 'react-select'

const formSchema = z.object({
  collection: z.string().nonempty("Collection is required"),
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()),
  category: z.string().nonempty("Category is required"),
  price: z.coerce.number().min(0.1),
})

interface ProductFormProps {
  initialData?: ProductType | null
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [collectionOptions, setCollectionOptions] = useState<{ value: string; label: string }[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collection: initialData?.collections?.[0]?._id || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      media: initialData?.media || [],
      category: initialData?.category || "",
      price: initialData?.price || 0,
    },
  })

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections")
        if (!res.ok) throw new Error("Failed to fetch collections")
        const data = await res.json()
        const collections = data.map((collection: CollectionType) => ({
          value: collection._id,
          label: collection.title,
        }))
        setCollectionOptions(collections)
      } catch (error) {
        console.error("Failed to fetch collections:", error)
        toast.error("Failed to fetch collections")
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    const fetchCategories = async (collectionId: string) => {
      if (!collectionId) return;
      try {
        const res = await fetch(`/api/collections/${collectionId}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        
        // Assuming the response includes _id and title
        const categories = data.map((category: { _id: string; title: string }) => ({
          value: category, // Use the ObjectId as value
          label: category, // Show the title in the select dropdown
        }));
        
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      }
        
   };
   

    const collectionId = form.watch('collection')
    if (collectionId) {
      fetchCategories(collectionId)
    }
  }, [form.watch('collection')])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        toast.success("Product created")
        router.push("/products")
      } else {
        const errorData = await res.json()
        toast.error(`Failed to create product: ${errorData.message || res.statusText}`)
      }
    } catch (err) {
      console.log("[products_POST] Error: ", err)
      toast.error("Something went wrong! Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10">
      <p className="text-heading2-bold text-black">Products</p>
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="collection"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Collection</FormLabel>
                <FormControl>
                  <Select
                    options={collectionOptions}
                    value={collectionOptions.find(option => option.value === field.value)}
                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                    className="text-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" className="text-black" {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Pictures</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) => field.onChange([...field.value.filter((v) => v !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Category</FormLabel>
                <FormControl>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(option => option.value === field.value)}
                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                    className="text-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-blue-1 text-white">
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}