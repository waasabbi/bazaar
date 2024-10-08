"use client"

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-black shadow-xl max-lg:hidden">
      {/* <Image src="" alt="logo" width={150} height={70} /> */}

      <div>Urban Bazaar</div>

      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : "text-grey-1"
              }`}>

            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-body-medium items-center">
        <SignedIn>
          <UserButton />
          <p>Edit Profile</p>
        </SignedIn>
        <SignedOut>
          <p>Please sign in to edit your profile</p>
        </SignedOut>
      </div>        
      </div>
  );
};

export default LeftSideBar;