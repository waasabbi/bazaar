import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import Category from "@/lib/models/Category";

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string, categoryId: string } }) => {
    try {
        await connectToDB(); // Ensure DB connection

        const { collectionId, categoryId } = params;

        // Find products by collectionId and categoryId
        const products = await Product.find({
            collection: collectionId,
            categories: categoryId,
        });

        if (!products) {
            return new NextResponse(JSON.stringify({ message: "No products found" }), { status: 404 });
        }
        console.log(products)
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error("[Product_GET]", error);
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
};


// POST /api/collections/[collectionId]/categories/[categoryId]/products
export const POST = async (req: NextRequest, { params }: { params: { collectionId: string, categoryId: string } }) => {
    try {
        await connectToDB(); // Ensure DB connection

        const { collectionId, categoryId } = params;
        const {
            name,
            description,
            media,
            price,
            sizes,
            colors,
            unitsInStock,
            dimensions
        } = await req.json(); // Parse the incoming JSON payload

        // Create new product
        const newProduct = new Product({
            name,
            description,
            media,
            price: mongoose.Types.Decimal128.fromString(price.toString()), // Handling price as Decimal128
            sizes,
            colors,
            unitsInStock,
            dimensions,
            categories: [categoryId], // Store the category
            collection: collectionId,  // Store the collection
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // After saving the product, update the Category model to include this product
        await Category.findByIdAndUpdate(
            categoryId,
            { $push: { products: savedProduct._id } },  // Add the product ID to the products array in the category
            { new: true }  // Return the updated category document
        );

        return new NextResponse(JSON.stringify({ message: "Product created successfully!" }), { status: 201 });
    } catch (error) {
        console.error("[Product_POST]", error);
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
};

