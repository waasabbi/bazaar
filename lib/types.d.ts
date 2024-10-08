export type CollectionType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    products: ProductType[]; // Array of associated products
    categories: CategoryType[];
    createdAt: Date;
    updatedAt: Date;
};

export type CategoryType = {
    _id: string;
    title: string;
    collection: CollectionType[];
    products: ProductType[];
    createdAt: Date;
    updatedAt: Date;
};
 
export type ProductType = {
    _id: string;
    title: string;
    description: string;
    price: number;
    media: string[];
    category: string;
    collections: CollectionType[]; // Array of collection objects
    tags: string[];
    sizes: string[];
    colors: string[];
    createdAt: Date;
    updatedAt: Date;
};

  
 export type OrderColumnType = {
    _id: string;
    customer: string;
    products: number; // Number of products in the order
    totalAmount: number; // Total amount of the order
    createdAt: string; // Date of order creation
  };
  
  export type OrderItemType = {
    product: ProductType; // The product in the order
    color: string; // Color chosen by the customer
    size: string; // Size chosen by the customer
    quantity: number; // Quantity ordered
  };
  
  type CustomerType = {
    clerkId: string; // Clerk's unique identifier for the customer
    name: string;
    email: string;
  };
  