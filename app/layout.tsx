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

  // Kiểm tra trạng thái đăng nhập & kích hoạt tài khoản
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser && currentUser.role !== 'admin') {
      const appUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbUser = appUsers.find((u: any) => u.username === currentUser.username);

      // Nếu tài khoản bị xóa
      if (!dbUser) {
        alert('Tài khoản của bạn đã bị xóa khỏi hệ thống!');
        localStorage.removeItem('currentUser');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(null);
        router.push('/');
        return;
      }

      // Nếu tài khoản bị Admin khóa
      if (dbUser.status === 'Tạm khóa') {
        alert('Tài khoản của bạn đã bị Admin khóa!');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        router.push('/');
        return;
      }
    }

    requestAnimationFrame(() => {
      setCurrentUser(currentUser);
    });
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    router.push('/');
  };

  // Helper kiểm tra đường dẫn đang active
  const isActive = (path: string) => pathname === path;

  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        {/* Navigation Bar */}
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #1e293b',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Logo Brand */}
          <Link
            href={currentUser?.role === 'admin' ? '/admin' : '/shop'}
            style={{
              color: '#38bdf8',
              fontWeight: '800',
              fontSize: '1.3rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              letterSpacing: '-0.02em'
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}>⚡</span>
            TechStore
          </Link>

          {/* Menu Items */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {currentUser ? (
              <>
                {/* Menu Admin */}
                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    style={{
                      color: isActive('/admin') ? '#38bdf8' : '#94a3b8',
                      background: isActive('/admin') ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: isActive('/admin') ? '600' : '500',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    🛡️ Trang Admin
                  </Link>
                )}

                {/* Menu User */}
                {currentUser.role === 'user' && (
                  <>
                    <Link
                      href="/shop"
                      style={{
                        color: isActive('/shop') ? '#38bdf8' : '#94a3b8',
                        background: isActive('/shop') ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: isActive('/shop') ? '600' : '500',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      🛒 Cửa hàng
                    </Link>
                    <Link
                      href="/user"
                      style={{
                        color: isActive('/user') ? '#38bdf8' : '#94a3b8',
                        background: isActive('/user') ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: isActive('/user') ? '600' : '500',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      🛍️ Giỏ hàng
                    </Link>
                  </>
                )}

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '20px', background: '#334155', margin: '0 8px' }} />

                {/* User Info Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#1e293b',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid #334155'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    background: currentUser.role === 'admin' ? '#ef4444' : '#10b981',
                    color: '#ffffff'
                  }}>
                    {currentUser.role}
                  </span>
                  <span style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: '600' }}>
                    {currentUser.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                    marginLeft: '4px'
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                🔑 Đăng nhập
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content Container */}
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}