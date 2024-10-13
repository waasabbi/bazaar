import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Category from "@/lib/models/Category";

export const DELETE = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await connectToDB();

        // Find the category by categoryId
        const category = await Category.findById(params.categoryId);

        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        // Find the collection to which this category belongs
        const collection = await Collection.findById(category.collection);

        if (!collection) {
            return new NextResponse("Collection not found", { status: 404 });
        }

        // Remove the category reference from the collection
        await Collection.updateOne(
            { _id: collection._id },
            { $pull: { categories: category._id } }
        );

        // Delete the category
        await Category.findByIdAndDelete(params.categoryId);

        return new NextResponse("Category deleted successfully", { status: 200 });
    } catch (err) {
        console.log("[category_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
