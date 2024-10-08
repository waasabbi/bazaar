"use client";

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
import { useRouter } from "next/navigation"; // useRouter from "next/navigation"
import { useState } from 'react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ImageUpload from "../custom ui/ImageUpload";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.string()
});

const CollectionForm = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            image: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Submitting form with values:", values); // Add this line
        try {
            setLoading(true);
            const res = await fetch("/api/collections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setLoading(false);
                toast.success("Collection created");
                router.push("/collections");
            } else {
                console.log(await res.json());
                toast.error("Error! Please try again.");
            }
        } catch (err) {
            console.log("[collections_POST]", err);
            toast.error("Error! Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="p-10">
            <p className="text-heading2-bold text-black">Create Collection</p>
            <Separator className="bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Title" 
                                        {...field} 
                                        className="text-black" // Set text color to black
                                    />
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
                                    <Textarea 
                                        placeholder="Description" 
                                        {...field} 
                                        rows={5}
                                        className="text-black" // Set text color to black
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Add Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value ={field.value ? [field.value] : []} onChange = {(url) => field.onChange(url)} onRemove = {() => field.onChange("")}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-6">
                        <Button type="submit" className="bg-blue-1 text-white">
                            Submit
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push("/collections/new")}
                            className="bg-red-1 text-red">
                            Discard
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CollectionForm;
