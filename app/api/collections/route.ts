import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
import Category from "@/lib/models/Category";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await connectToDB();

        const { title, description, image, categories } = await req.json(); // Now includes categories

        const existingCollection = await Collection.findOne({ title });

        if (existingCollection) {
            return new NextResponse("Collection already", { status: 400 });
        }

        if (!title || !image) {
            return new NextResponse("Title and image are required", { status: 400 });
        }

        // Create the new collection
        const newCollection = new Collection({
            title,
            description,
            image,
        });

        // If categories are provided, create and associate them with the collection
        if (categories && categories.length > 0) {
            for (const categoryTitle of categories) {
                const existingCategory = await Category.findOne({ title: categoryTitle, collection: newCollection._id });

                // Check if the category already exists in this collection
                if (!existingCategory) {
                    const newCategory = new Category({
                        title: categoryTitle,
                        collection: newCollection._id,
                    });
                    await newCategory.save();

                    // Associate the category with the collection
                    newCollection.categories.push(newCategory._id);
                }
            }
        }

        await newCollection.save(); // Save the collection with categories

        return NextResponse.json(newCollection, { status: 200 });
    } catch (err) {
        console.log("[collections_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};


export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        // Fetch collections and populate the categories
        const collections = await Collection.find()
            .sort({ createdAt: "desc" })
            .populate('categories'); // Populate the categories field

        return NextResponse.json(collections, { status: 200 });
    } catch (err) {
        console.log("[collections_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";