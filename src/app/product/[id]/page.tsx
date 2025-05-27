'use client';

import { TopBar, Footer } from '@/components';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  imageURL: string;
  price: string;
  description: string;
  category: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Error loading product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItem(product.id, quantity);
        toast.success(`${product.description} adicionado ao carrinho!`);
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        toast.error('Não foi possível adicionar o produto ao carrinho.');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <TopBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen">
        <TopBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl text-red-500">{error || 'Produto não encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <TopBar />
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-white rounded-lg">
              <Image
                src={product.imageURL}
                alt={product.description}
                width={400}
                height={400}
                className="object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.description}</h1>
            <p className="text-gray-600 mb-4 capitalize">{product.category}</p>
            <h2 className="text-2xl font-bold mb-6">R$ {product.price},00</h2>
            
            <div className="flex items-center mb-6">
              <span className="mr-4">Quantidade:</span>
              <div className="flex items-center border rounded">
                <Button 
                  className="px-3 py-1 border-r cursor-pointer"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="px-4 py-1">{quantity}</span>
                <Button 
                  className="px-3 py-1 border-l cursor-pointer"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <Button 
              className="bg-[#D53232] text-white w-full mb-4 text-lg py-6 cursor-pointer" 
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </Button>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Descrição do Produto</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}