import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';

interface ProductCardProps {
  id: string;
  image: string | StaticImageData;
  price: string;
  description: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  price,
  description,
  category
}) => {
  return (
    <Link href={`/product/${id}`} className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="items-start flex flex-col justify-between w-full pl-6 pr-6">
        <div className="relative w-full h-[220px] flex items-center justify-center mb-3 overflow-hidden">
          <Image 
            src={image} 
            alt={description} 
            width={220}
            height={220}
            className="object-contain" 
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
        <h1 className="font-semibold text-lg leading-7 line-clamp-2">{description}</h1>
        <p className="font-normal text-sm leading-6">{category}</p>
        <h1 className="font-semibold text-xl leading-7">{price}</h1>
      </div>
    </Link>
  );
};

export default ProductCard;