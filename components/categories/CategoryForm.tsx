'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import ImageUpload from "../custom ui/ImageUpload";

// Updated form schema based on the backend
const formSchema = z.object({
    name: z.string().min(2, "Category name is required").max(20).nonempty("Name is required"),
    description: z.string().optional(),
    image: z.string().nonempty("Image URL is required"),
});

const CategoryForm = ({ collectionId }: { collectionId: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            // Make POST request to create a new category
            const res = await fetch(`/api/collections/${collectionId}/categories/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    collection: collectionId, // Link the collectionId to the category
                }),
            });

            if (res.ok) {
                toast.success("Category created successfully");
                router.push(`/collections/${collectionId}/categories`); // Redirect after success
            } else {
                const error = await res.json();
                toast.error(error.error || "Error creating category");
            }
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Error creating category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10">
            <p className="text-heading2-bold text-black">Add Category to Collection</p>
            <Separator className="bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Category Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Category Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Category Name"
                                        {...field}
                                        className="text-black"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Category Description"
                                        {...field}
                                        className="text-black"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Image */}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Add Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-6">
                        <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
                            Submit
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push(`/collections/${collectionId}/categories`)}
                            className="bg-red-1 text-red"
                        >
                            Discard
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CategoryForm;
