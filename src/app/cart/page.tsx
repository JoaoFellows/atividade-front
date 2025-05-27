'use client';

import React from 'react';
import { ItemCart, RedSidebar } from '@/components';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const { items, isLoading, removeItem } = useCart();
  const router = useRouter();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conteúdo principal */}
      <div className="flex-1 pt-9 pl-[69px] pr-4 gap-[82px] overflow-y-auto">
        {/* Botão de voltar */}
        <div className="absolute top-6 left-6">
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-[#d53232] rounded-full cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft size={24} />
          </Button>
        </div>
        
        {/* Aumentando o espaço com margin-top (mt-10) */}
        <div className="flex gap-[38px] items-center mt-10">
          <ShoppingCart size={54} />
          <h1 className="font-bold text-[48px]">CARRINHO</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Carregando seus itens...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6">
            <p className="text-xl">Seu carrinho está vazio</p>
            <Button 
              onClick={() => router.push('/product')}
              className="bg-[#D53232] text-white cursor-pointer"
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '48px',
              marginTop: '82px'
            }}
          >
            {items.map((item) => (
              item.product && (
                <ItemCart
                  key={item.productId}
                  image={item.product.imageURL}
                  description={item.product.description}
                  price={`R$ ${item.product.price},00 ${item.quantity > 1 ? `x ${item.quantity}` : ''}`}
                  onRemove={() => removeItem(item.productId)}
                />
              )
            ))}
          </div>
        )}
      </div>
      <RedSidebar />
    </div>
  );
};

export default CartPage;