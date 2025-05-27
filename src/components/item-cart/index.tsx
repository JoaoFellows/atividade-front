import React from 'react';
import Image from 'next/image';

interface ItemCartProps {
  image: string;
  description: string;
  price: string;
  onRemove?: () => void;
}

const ItemCart: React.FC<ItemCartProps> = ({ image, description, price, onRemove }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '23px' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <Image
          src={image}
          alt={description}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p className="font-medium text-[20px] ">{description}</p>
        <p className="font-medium text-[18px] text-neutral-400">{price}</p>
      </div>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="ml-auto text-red-500 hover:text-red-700 px-4 py-2"
        >
          Remover
        </button>
      )}
    </div>
  );
};

export default ItemCart;