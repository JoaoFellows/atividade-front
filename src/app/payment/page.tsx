"use client";

import Image from 'next/image';
import { mastercard, visa, pix } from '@/assets';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import TopBar from '../../components/top-bar';
import Footer from '../../components/footer';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const { items, total, isLoading, clearCart } = useCart();
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalWithTax, setTotalWithTax] = useState(0);
  const router = useRouter();

  // Calcular a taxa e o total com taxa incluída
  useEffect(() => {
    const taxRate = 0.05; // 5%
    const calculatedTax = total * taxRate;
    setTaxAmount(calculatedTax);
    setTotalWithTax(total + calculatedTax);
  }, [total]);

  // Redirecionar se o carrinho estiver vazio
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [items, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await clearCart();
      
      alert('Pagamento confirmado! Obrigado pela compra.');
      
      router.push('/');
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      alert('Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopBar />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Carregando informações do pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="container mx-auto p-8 flex flex-col lg:flex-row justify-between gap-8">
        {/* Payment List */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold mb-6">Pagamento</h2>
          {items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nenhum item no carrinho para pagar</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                item.product && (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-200 rounded-lg">
                    <div className="relative w-12 h-12 overflow-hidden rounded-full">
                      <Image 
                        src={item.product.imageURL} 
                        alt={item.product.description}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.description}</p>
                      <p className="text-sm text-gray-600">
                        {item.product.category} {item.quantity > 1 ? `(${item.quantity}x)` : ''}
                      </p>
                    </div>
                    <p className="font-semibold">
                      R$ {(parseInt(item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0 p-6 bg-[#d53232] text-white rounded-lg">
          <h3 className="text-xl font-bold mb-4">Detalhes do Cartão</h3>
          <div className="flex gap-4 mb-4 justify-center">
            <Image src={mastercard} alt="Mastercard" width={60} height={30} />
            <Image src={visa} alt="Visa" width={60} height={30} />
            <Image src={pix} alt="Pix" width={60} height={30} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Label htmlFor="name">Nome no Cartão</Label>
            <Input id="name" type="text" className="text-black" required />

            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input 
              id="cardNumber" 
              type="text" 
              placeholder="1111 2222 3333 4444" 
              className="text-black" 
              required
              maxLength={19}
            />

            <div className="flex space-x-4">
              <div className="w-1/2">
                <Label htmlFor="expiry">Válido até</Label>
                <Input 
                  id="expiry" 
                  type="text" 
                  placeholder="MM/AA" 
                  className="text-black" 
                  required
                  maxLength={5}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  type="text" 
                  placeholder="123" 
                  className="text-black" 
                  required
                  maxLength={4}
                />
              </div>
            </div>
            <div className="mt-6 text-lg">
              <p>Total: <span className="font-bold">
                R$ {total.toFixed(2).replace('.', ',')}
              </span></p>
              <p>Taxa (5%): <span className="font-bold">
                R$ {taxAmount.toFixed(2).replace('.', ',')}
              </span></p>
              <p className="font-bold text-xl">
                Total (Taxa Incl.): R$ {totalWithTax.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <Button 
              type="submit"
              className="w-full mt-4 bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer"
              disabled={items.length === 0}
            >
              Confirmar Pagamento
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}