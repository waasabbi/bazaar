import CategoryForm from '@/components/categories/CategoryForm'
import React from 'react'

const Page = ({ params }: { params: { collectionId: string } }) => {
  const { collectionId } = params; // Extract collectionId from params

  return (
    <div>
      <CategoryForm collectionId={collectionId} /> {/* Pass collectionId to CategoryForm */}
    </div>
  );
}

export default Page;
