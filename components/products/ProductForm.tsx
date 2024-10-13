'use client';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ImageUpload from "../custom ui/ImageUpload";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import Select from 'react-select';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()), // Array of image URLs
  price: z.coerce.number().min(0.1), // Coerce to number
  sizes: z.array(z.object({
    size: z.string().min(1), 
    stock: z.coerce.number().min(0) // Coerce to number
  })),
  colors: z.array(z.object({
    colorName: z.string().min(1),
    colorCode: z.string().optional(),
    stock: z.coerce.number().min(0) // Coerce to number
  })),
  unitsInStock: z.coerce.number().min(0), // Coerce to number
  dimensions: z.object({
    length: z.coerce.number().optional(), // Coerce to number
    width: z.coerce.number().optional(),  // Coerce to number
    height: z.coerce.number().optional(), // Coerce to number
    weight: z.coerce.number().optional(), // Coerce to number
  }),
});

export default function ProductForm() {
  const router = useRouter();
  const params = useParams(); // Get collectionId and categoryId from params
  const { collectionId, categoryId } = params;

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      media: [],
      price: 0,
      sizes: [{ size: "", stock: 0 }], // Default size and stock
      colors: [{ colorName: "", colorCode: "", stock: 0 }], // Default color
      unitsInStock: 0,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
        weight: undefined
      }
    }
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: 'sizes'
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control: form.control,
    name: 'colors'
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Add collectionId and categoryId to the payload
      const payload = {
        ...values,
        collectionId,
        categoryId,
      };

      const res = await fetch(`/api/collections/${collectionId}/categories/${categoryId}/products`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Product created");
        router.push(`/collections/${collectionId}/categories/${categoryId}/products`);
      } else {
        const errorData = await res.json();
        toast.error(`Failed to create product: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("[products_POST] Error: ", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <p className="text-heading2-bold text-black">Products</p>
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
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

          {/* Media Upload */}
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

          {/* Price */}
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

          {/* Sizes */}
          <div>
            <FormLabel className="text-black">Sizes</FormLabel>
            {sizeFields.map((item, index) => (
              <div key={item.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`sizes.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Size" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sizes.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Stock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => removeSize(index)}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => appendSize({ size: '', stock: 0 })}>Add Size</Button>
          </div>

          {/* Colors */}
          <div>
            <FormLabel className="text-black">Colors</FormLabel>
            {colorFields.map((item, index) => (
              <div key={item.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`colors.${index}.colorName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Color Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`colors.${index}.colorCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Color Code (Optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`colors.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" placeholder="Stock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => removeColor(index)}>Remove</Button>
              </div>
            ))}
            <Button onClick={() => appendColor({ colorName: '', colorCode: '', stock: 0 })}>Add Color</Button>
          </div>

          {/* Units in Stock */}
          <FormField
            control={form.control}
            name="unitsInStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Total Units in Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Units in Stock" className="text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dimensions */}
          <div>
            <FormLabel className="text-black">Dimensions (Optional)</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dimensions.length"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Length" className="text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions.width"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Width" className="text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions.height"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Height" className="text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions.weight"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Weight" className="text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              type="button"
              onClick={() => router.push(`/collections/${collectionId}/categories/${categoryId}/products`)}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
