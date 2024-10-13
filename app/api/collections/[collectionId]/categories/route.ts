import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoDB'
import { ObjectId } from 'mongodb'
import Collection from '@/lib/models/Collection'
import Category from '@/lib/models/Category'
import { CollectionType, CategoryType } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = params
    await connectToDB()

    const collection = await Collection.findOne({ _id: new ObjectId(collectionId) })
      .populate('categories')
      .lean() as CollectionType | null

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Extract category names from the populated categories
    const categories = collection.categories.map((category: CategoryType) => category)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


export async function POST(
  request: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = params;
    const { name, description, image } = await request.json(); // Extract body content

    await connectToDB();

    const collection = await Collection.findOne({ _id: new ObjectId(collectionId) });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Create the new category
    const newCategory = new Category({
      title: name,
      description: description || '', // Optional description
      image: image, // Image URL is required
      collection: collection._id, // Link the category to the collection
    });

    // Save the category
    await newCategory.save();

    // Add the category to the collection
    collection.categories.push(newCategory._id);
    await collection.save();

    return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

