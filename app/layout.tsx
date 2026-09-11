'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  username: string;
  role: 'admin' | 'user';
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra trạng thái đăng nhập mỗi khi chuyển trang
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    requestAnimationFrame(() => {
      setCurrentUser(user);
    });
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    router.push('/');
  };

  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc' }}>
        <nav style={{ background: '#0f172a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href={currentUser?.role === 'admin' ? '/admin' : '/shop'} style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
            ⚡ TechStore
          </Link>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {currentUser ? (
              <>
                {/* Menu riêng dành cho Admin */}
                {currentUser.role === 'admin' && (
                  <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>
                    🛡️ Trang Admin
                  </Link>
                )}

                {/* Menu riêng dành cho User */}
                {currentUser.role === 'user' && (
                  <>
                    <Link href="/shop" style={{ color: '#fff', textDecoration: 'none' }}>
                      🛒 Cửa hàng
                    </Link>
                    <Link href="/user" style={{ color: '#fff', textDecoration: 'none' }}>
                      🛍️ Giỏ hàng
                    </Link>
                  </>
                )}

                {/* Tên người dùng & Nút Đăng xuất */}
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem', marginLeft: '5px' }}>
                  👋 {currentUser.username}
                </span>

                <button
                  onClick={handleLogout}
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                🔑 Đăng nhập
              </Link>
            )}
          </div>
        </nav>

        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}