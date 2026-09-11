'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  img?: string;
}

const defaultProducts: Product[] = [
  { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
  { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
  { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' },
  { id: 4, name: 'Đồng hồ Smartwatch Series 9', price: 9500000, img: '⌚' },
  { id: 5, name: 'Bàn phím cơ RGB', price: 1800000, img: '⌨️' },
  { id: 6, name: 'Chuột không dây Gaming', price: 850000, img: '🖱️' },
  { id: 7, name: 'Màn hình 4K 27 inch', price: 8900000, img: '🖥️' },
  { id: 8, name: 'Máy ảnh Mirrorless Ultra', price: 18500000, img: '📷' },
  { id: 9, name: 'Tay cầm Gamepad Pro', price: 1200000, img: '🎮' }
];

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
      router.push('/');
      return;
    }

    requestAnimationFrame(() => {
      setUser(currentUser);

      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        setProducts(defaultProducts);
      }
    });
  }, [router]);

  const addToCart = (product: Product) => {
    if (!user) return;

    // Tối ưu giỏ hàng riêng cho từng User
    const userCartKey = `cart_${user.username}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey) || localStorage.getItem('cart') || '[]');

    cart.push(product);
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    localStorage.setItem('cart', JSON.stringify(cart)); // Đồng bộ thêm key chung

    alert(`🎉 Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  if (!user) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* 1. Hero Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '2.25rem 2rem',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            TechStore Catalog
          </span>
          <h1 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.75rem', fontWeight: '800' }}>
            🛍️ Cửa Hàng Công Nghệ
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Xin chào, <b style={{ color: '#f8fafc' }}>{user.username}</b>! Hãy lựa chọn những thiết bị hàng đầu.
          </p>
        </div>

        {/* Ô Tìm Kiếm Nhanh */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* 2. Grid Danh Sách Sản Phẩm */}
      {filteredProducts.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Không tìm thấy sản phẩm</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Vui lòng thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                {/* Khung Ảnh/Emoji */}
                <div style={{
                  height: '140px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  border: '1px solid #f1f5f9'
                }}>
                  {p.img && (p.img.startsWith('http://') || p.img.startsWith('https://')) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: '3.5rem' }}>{p.img || '📦'}</span>
                  )}
                </div>

                {/* Tên sản phẩm */}
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  lineHeight: '1.4'
                }}>
                  {p.name}
                </h3>
              </div>

              {/* Giá & Nút Thêm Giỏ Hàng */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: '#2563eb',
                  marginBottom: '0.75rem'
                }}>
                  {p.price.toLocaleString()} VNĐ
                </div>

                <button
                  onClick={() => addToCart(p)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '0.7rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
                  }}
                >
                  🛒 Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}