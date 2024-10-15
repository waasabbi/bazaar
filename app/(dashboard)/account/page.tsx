'use client'; // If you're using Next.js App Router

import { useUser, UserButton } from '@clerk/nextjs';
// import Image from 'next/image';

export default function page() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <div className="mt-4">
        <UserButton/>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
        {/* {user.imageUrl && (
          <Image src={user.imageUrl} alt="Profile" className="rounded-full w-32 h-32 mt-4" width={50} height={50}/>
        )} */}
      </div>
    </div>
  );
}
