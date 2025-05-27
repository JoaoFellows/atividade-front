import React from 'react';
import Image from 'next/image';

interface CartItemProps {
  image: string;
  description: string;
  price: string;
  quantity?: number;
}

const CartItem: React.FC<CartItemProps> = ({ image, description, price, quantity = 1 }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Image src={image} alt={description} width={80} height={80} className="rounded-md" />
      <div className="flex flex-col gap-1">
        <p className="text-[18px] font-semibold">{description}</p>
        <p className="text-[16px]">Qtd: {quantity}</p>
        <p className="text-[14px] font-bold">{price}</p>
      </div>
    </div>
  );
};

export default CartItem;