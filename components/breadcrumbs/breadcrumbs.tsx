'use client'

import { Home, Slash } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  const searchParams = useSearchParams();

  const getHrefWithParams = (href: string) => {
    const url = new URL(href, window.location.origin);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    return url.pathname + url.search;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash className="h-4 w-4" />
        </BreadcrumbSeparator>
        {items.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {index === items.length - 1 ? (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink href={getHrefWithParams(item.href)} asChild>
                  <Link href={getHrefWithParams(item.href)}>{item.name}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator>
                  <Slash className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}