import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
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
    const categories = collection.categories.map((category: CategoryType) => category.title)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}