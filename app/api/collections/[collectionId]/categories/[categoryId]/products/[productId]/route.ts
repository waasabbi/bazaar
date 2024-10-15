import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import Product from '@/lib/models/Product';
import { auth } from '@clerk/nextjs/server';

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string; collectionId: string; categoryId: string } }) => {
    try {
        const { userId } = auth(); // Authentication to verify user

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await connectToDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Delete the product
        await Product.findByIdAndDelete(params.productId);

        return new NextResponse("Product deleted successfully", { status: 200 });
    } catch (err) {
        console.log("[product_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
