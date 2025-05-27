'use client';

import { TopBar, Footer } from '@/components';
import { SystemCompra } from '@/assets';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  imageURL: string;
  price: string;
  description: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        
        // Obter categorias únicas
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))] as string[];
        setCategories(uniqueCategories);
        
        // Selecionar 4 produtos em destaque (aleatórios ou por alguma lógica de destaque)
        // Para este exemplo, vamos pegar os primeiros 4 produtos de diferentes categorias se possível
        const featured: Product[] = [];
        const categoriesUsed = new Set<string>();
        
        // Primeiro, tente pegar um produto de cada categoria
        for (const category of uniqueCategories) {
          if (featured.length >= 6) break;
          
          const productOfCategory = data.find((p: Product) => 
            p.category === category && !categoriesUsed.has(p.category)
          );
          
          if (productOfCategory) {
            featured.push(productOfCategory);
            categoriesUsed.add(category);
          }
        }
        
        // Se ainda não tiver 4 produtos, complete com outros produtos
        if (featured.length < 6) {
          for (const product of data) {
            if (featured.length >= 6) break;
            if (!featured.some(p => p.id === product.id)) {
              featured.push(product);
            }
          }
        }
        
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      <TopBar></TopBar>
      <div className="flex items-center h-full justify-between">
        <div className="pl-14 flex flex-col gap-6 max-w-[580px] justify-start">
          <h1 className="text-[50px] font-bold leading-[68px] ">
            Easy Click: Suas compras a um clique de distância!
          </h1>
          <p className="font-normal text-[18px] leading-[27px] text-justify">
            Na Easy Click, você encontra praticidade, agilidade e segurança para fazer suas compras online. 
            Navegue por uma variedade de produtos, compare preços e finalize sua compra em poucos cliques. 
            Tudo isso com um atendimento eficiente e entrega rápida, do jeito que você merece.
            Comprar nunca foi tão fácil. É só clicar!
          </p>
        </div>
        <Image src={SystemCompra} alt="Logo" className="h-full" width={600} height={600} />
      </div>

      <div className="flex flex-col py-10 gap-10 w-full bg-[#D53232]">
        <div className="flex justify-between px-16 py-5 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-[48px] leading-[58px] text-white">
              Produtos em destaque
            </h1>
            <p className="font-normal text-[18px] leading-[27px] text-white">
              Confira os produtos mais populares da nossa loja
            </p>
          </div>
          <Button 
            className="text-black bg-white h-10 text-lg hover:bg-gray-100"
            onClick={() => window.scrollTo({ top: document.getElementById('all-products')?.offsetTop, behavior: 'smooth' })}
          >
            Ver todos
          </Button>
        </div>
        <div className="flex gap-14 px-8 h-full justify-self-center overflow-x-auto pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full py-10">
              <p className="text-white text-xl">Carregando produtos em destaque...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.imageURL}
                description={product.description}
                price={`R$ ${product.price},00`}
                category={product.category}
              />
            ))
          ) : (
            <p className="text-white text-xl text-center w-full">Nenhum produto em destaque encontrado</p>
          )}
        </div>
      </div>
      
      {/* Products by category */}
      <div id="all-products" className="py-12 px-14">
        <h2 className="text-3xl font-bold mb-10">Produtos</h2>
        
        {categories.map((category) => (
          <section key={category} className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 capitalize">
              {category}s
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.imageURL}
                    price={`R$ ${product.price},00`}
                    description={product.description}
                    category={product.category}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      <Footer></Footer>
    </div>
  );
}