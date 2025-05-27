'use client';

import { TopBar, Footer } from '@/components';
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
        
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))] as string[];
        setCategories(uniqueCategories);
        
        const featured: Product[] = [];
        const categoriesUsed = new Set<string>();
        
        for (const category of uniqueCategories) {
          if (featured.length >= 5) break;
          
          const productOfCategory = data.find((p: Product) => 
            p.category === category && !categoriesUsed.has(p.category)
          );
          
          if (productOfCategory) {
            featured.push(productOfCategory);
            categoriesUsed.add(category);
          }
        }
        
        if (featured.length < 5) {
          for (const product of data) {
            if (featured.length >= 5) break;
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