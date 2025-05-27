"use client"
import React, { useEffect, useState } from 'react';
import CartItem from './itens';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  imageURL: string;
  price: string;
  description: string;
  category: string;
}

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product?: Product;
}

const RedSidebar: React.FC = () => {
  const router = useRouter();
  const { items, total } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false after a short delay to ensure items are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-1/3 bg-red-500 text-white pt-6 pl-8 pr-7 pb-8">
        <h2 className="text-[20px] font-bold">Carregando seu carrinho...</h2>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-red-500 text-white pt-6 pl-8 pr-7 pb-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold">
          {items.length === 0
            ? "Seu carrinho está vazio"
            : items.length === 1
            ? "Seu carrinho tem um item"
            : `Seu carrinho tem ${items.length} itens`}
        </h2>
      </div>

      {/* Traço preto */}
      <div className="h-0.5 bg-black mb-4"></div>

      {/* Body */}
      <div className="flex flex-col gap-12">
        {items.length === 0 ? (
          <p className="text-center py-8">Nenhum item no carrinho</p>
        ) : (
          items.map((item) => (
            item.product && (
              <CartItem
                key={item.productId}
                image={item.product.imageURL}
                description={item.product.description}
                price={`R$ ${(parseInt(item.product.price) * item.quantity).toFixed(2).replace('.', ',')}`}
                quantity={item.quantity}
              />
            )
          ))
        )}
      </div>

      {/* Traço preto */}
      <div className="h-0.5 bg-black mb-4"></div>

      {/* Footer */}
      <div className='flex flex-col gap-[70px]'>
        <div className="flex gap-[183px]">
          <p className="text-[20px] font-medium">Total:</p>
          <p className="text-[20px] font-bold">
            {`R$ ${total.toFixed(2).replace('.', ',')}`}
          </p>
        </div>
        <Button 
          onClick={() => router.push("/payment")}
          disabled={items.length === 0}
          className="{`${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} cursor-pointer"
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
};

export default RedSidebar;