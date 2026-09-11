'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  username: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  img?: string;
  quantity?: number;
}

export default function UserPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      router.push('/');
    } else {
      requestAnimationFrame(() => {
        setCurrentUser(user);
        // Tải giỏ hàng riêng của User (nếu chưa có thì đọc key chung 'cart')
        const userCartKey = `cart_${user.username}`;
        const savedCart = localStorage.getItem(userCartKey) || localStorage.getItem('cart') || '[]';
        setCart(JSON.parse(savedCart));
      });
    }
  }, [router]);

  // Hàm đồng bộ giỏ hàng vào localStorage
  const updateCart = (newCart: Product[]) => {
    setCart(newCart);
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(newCart));
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updated = cart.filter((_, index) => index !== indexToRemove);
    updateCart(updated);
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      updateCart([]);
    }
  };

  const handleCheckout = () => {
    alert('🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.');
    updateCart([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (!currentUser) return null;

  // Tính tổng tiền giỏ hàng
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>

      {/* 1. Profile Header Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.025)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: '700' }}>
                {currentUser.username}
              </h2>
              <span style={{
                background: currentUser.role === 'admin' ? '#fef2f2' : '#f0fdf4',
                color: currentUser.role === 'admin' ? '#dc2626' : '#16a34a',
                border: `1px solid ${currentUser.role === 'admin' ? '#fecaca' : '#bbf7d0'}`,
                padding: '0.15rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {currentUser.role}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
              Chào mừng trở lại trang quản lý tài khoản cá nhân
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>

      {/* 2. Cart Main Section */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🛒 Giỏ Hàng Của Bạn
            <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
              {cart.length}
            </span>
          </h3>

          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
            >
              🗑️ Xóa tất cả
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '1.1rem' }}>Giỏ hàng của bạn đang trống</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Hãy chọn thêm các sản phẩm công nghệ yêu thích nhé!</p>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              🛍️ Khám phá cửa hàng ngay
            </Link>
          </div>
        ) : (
          /* Cart List & Summary Grid */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {item.img && (item.img.startsWith('http://') || item.img.startsWith('https://')) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                      ) : (
                        item.img || '📦'
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '600' }}>
                        {item.name}
                      </h4>
                      <div style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>
                        {(item.price || 0).toLocaleString()} VNĐ
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(index)}
                    title="Xóa món này"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {/* Total Summary Footer */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '2px dashed #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'block' }}>Tổng thanh toán:</span>
                <span style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '800' }}>
                  {totalPrice.toLocaleString()} VNĐ
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                }}
              >
                💳 Thanh Toán Ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}