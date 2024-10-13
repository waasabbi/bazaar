import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Collection from "@/lib/models/Collection";
import Category from "@/lib/models/Category";

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        // Connect to the database
        await connectToDB();

        // Find the collection by collectionId
        const collection = await Collection.findById(params.collectionId).populate('categories');

        if (!collection) {
            return new NextResponse("Collection not found", { status: 404 });
        }

        return NextResponse.json(collection, { status: 200 });
    } catch (err) {
        console.log("[collection_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await connectToDB();

        const collection = await Collection.findById(params.collectionId);

        if (!collection) {
            return new NextResponse("Collection not found", { status: 404 });
        }

        // Delete associated categories
        await Category.deleteMany({ collection: collection._id });

        // Delete the collection
        await Collection.findByIdAndDelete(params.collectionId);

        return new NextResponse("Collection deleted successfully", { status: 200 });
    } catch (err) {
        console.log("[collection_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};