'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

interface Product {
  id: string;
  imageURL: string;
  price: string;
  description: string;
  category: string;
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_ID = 'user_cart'; // ID fixo para o carrinho (em um app real, seria baseado no usuário)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Criar um carrinho vazio no banco de dados
  const createEmptyCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: CART_ID,
          items: []
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create cart');
      }
      
      setItems([]);
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };
  
  // Atualizar o carrinho no banco de dados
  const updateCartInDb = async (newItems: CartItem[]) => {
    try {
      const response = await fetch(`http://localhost:3000/carts/${CART_ID}`, {
        method: 'PUT', // Mudado de PATCH para PUT para melhor compatibilidade
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: CART_ID,
          items: newItems
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', response.status, errorText);
        throw new Error(`Failed to update cart: ${response.status}`);
      }
      
      // Também atualizar no localStorage como fallback
      localStorage.setItem('cart', JSON.stringify(newItems));
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };
  
  // Inicializar carrinho e produtos
  useEffect(() => {
    const initializeCart = async () => {
      try {
        setIsLoading(true);
        console.log('Inicializando carrinho...');
        
        // Carregar produtos
        const productsResponse = await fetch('http://localhost:3000/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
          console.log('Produtos carregados:', productsData.length);
        } else {
          console.error('Erro ao carregar produtos:', productsResponse.status);
        }
        
        // Verificar se existe um carrinho
        console.log('Verificando carrinho com ID:', CART_ID);
        const cartResponse = await fetch(`http://localhost:3000/carts/${CART_ID}`);
        
        if (cartResponse.ok) {
          // Carrinho existe, carregar itens
          const cartData = await cartResponse.json();
          setItems(cartData.items || []);
          console.log('Carrinho carregado:', cartData);
        } else {
          // Carrinho não existe, criar um novo
          console.log('Carrinho não encontrado, criando novo...');
          await createEmptyCart();
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Fallback para localStorage se houver erro na API
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
          console.log('Carregado do localStorage como fallback');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeCart();
  }, []);
  
  // Adicionar item ao carrinho
  const addItem = async (productId: string, quantity = 1) => {
    try {
      // Primeiro, verificar se o produto existe
      const productExists = products.some(p => p.id === productId);
      if (!productExists) {
        console.error('Produto não encontrado:', productId);
        throw new Error('Produto não encontrado');
      }
      
      // Criar nova lista de itens
      const newItems = [...items];
      const existingItemIndex = newItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se o item já existir
        const existingItem = newItems[existingItemIndex];
        if (existingItem) {
          // Usar uma variável temporária para satisfazer TypeScript
          const updatedItem: CartItem = {
            productId: existingItem.productId,
            quantity: (existingItem.quantity || 0) + quantity
          };
          
          newItems[existingItemIndex] = updatedItem;
        }
      } else {
        // Adicionar novo item
        newItems.push({ productId, quantity });
      }
      
      // Atualizar estado local
      setItems(newItems);
      
      // Atualizar no banco de dados
      await updateCartInDb(newItems);
      
      console.log('Item adicionado ao carrinho:', { productId, quantity });
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  };
  
  // Remover item do carrinho
  const removeItem = async (productId: string) => {
    try {
      const newItems = items.filter(item => item.productId !== productId);
      setItems(newItems);
      await updateCartInDb(newItems);
      console.log('Item removido do carrinho:', productId);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  };
  
  // Atualizar quantidade do item
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }
      
      const newItems = items.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      );
      
      setItems(newItems);
      await updateCartInDb(newItems);
      console.log('Quantidade atualizada:', { productId, quantity });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  };
  
  // Limpar carrinho
  const clearCart = async () => {
    try {
      setItems([]);
      await updateCartInDb([]);
      console.log('Carrinho limpo');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  };
  
  // Calcular total de itens
  const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
  
  // Calcular preço total
  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? parseInt(product.price) * (item.quantity || 0) : 0);
  }, 0);

  // Criar carrinho com detalhes dos produtos
  const itemsWithProducts = items.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));
  
  return (
    <CartContext.Provider value={{ 
      items: itemsWithProducts, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      itemCount,
      total,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};