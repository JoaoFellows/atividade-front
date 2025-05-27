import React from 'react';
import Image from 'next/image';
import { LogoCompra } from '@/assets';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-[#d53232] items-center flex justify-between h-24 w-full pl-6 pr-6">
      <div
        className="flex cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        <Image src={LogoCompra} alt="Logo" width={100} height={100} />
      </div>
      <div className="flex gap-4 ">
        <div className="flex gap-4">
          {/* Botão para Carrinho */}
          <Button
            className="flex items-center gap-2 text-white bg-black h-10 text-lg hover:bg-gray-800 cursor-pointer border border-black"
            onClick={() => (window.location.href = '/cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;