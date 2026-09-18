'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserAccount {
  id?: number;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  status?: string;
}

const defaultUsers: UserAccount[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', status: 'Hoạt động' },
  { id: 2, username: 'user', password: '123', role: 'user', status: 'Hoạt động' },
  { id: 3, username: 'admin2', password: '123', role: 'admin', status: 'Hoạt động' },
  { id: 4, username: 'nguyenvana', password: '123', role: 'user', status: 'Hoạt động' },
  { id: 5, username: 'tranvanb', password: '123', role: 'user', status: 'Hoạt động' },
  { id: 6, username: 'user_bikhoa', password: '123', role: 'user', status: 'Tạm khóa' }
];

export default function RootAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('app_users')) {
      localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      if (currentUser.role === 'admin') router.push('/admin');
      else router.push('/shop');
    }
  }, [router]);

  // Điền nhanh thông tin tài khoản mẫu
  const fillSampleAccount = (accUser: string, accPass: string = '123') => {
    setUsername(accUser);
    setPassword(accPass);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: UserAccount[] = JSON.parse(localStorage.getItem('app_users') || '[]');

    if (isRegister) {
      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        setError('Tên đăng nhập này đã tồn tại trong hệ thống!');
        return;
      }

      const newUser: UserAccount = { id: Date.now(), username, password, role: 'user', status: 'Hoạt động' };
      users.push(newUser);

      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ id: newUser.id, username, role: 'user' }));

      alert('Đăng ký tài khoản mới thành công!');
      router.push('/shop');
    } else {
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!foundUser) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
        return;
      }

      if (foundUser.status === 'Tạm khóa') {
        setError('Tài khoản của bạn đã bị khóa! Vui lòng liên hệ Admin.');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      }));

      if (foundUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '1.5rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#e11010',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        border: '1px solid #f1f5f9',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box'
      }}>
        {/* Header Logo/Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 1rem',
            background: isRegister ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.5rem',
            boxShadow: isRegister ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' : '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
          }}>
            {isRegister ? '📝' : '🔐'}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.4rem 0' }}>
            {isRegister ? 'Tạo Tài Khoản Mới' : 'Chào Mừng Trở Lại'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            {isRegister ? 'Nhập thông tin để tạo tài khoản truy cập' : 'Vui lòng đăng nhập để tiếp tục thao tác'}
          </p>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div style={{
            background: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Nhập */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: isRegister ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '0.25rem',
              boxShadow: isRegister ? '0 4px 12px rgba(16, 185, 129, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Chuyển đổi giữa Đăng nhập / Đăng ký */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.875rem',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </button>
        </div>

        {/* Khung tài khoản dùng thử nhanh */}
        {!isRegister && (
          <div style={{
            marginTop: '1.75rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 0.6rem 0', fontWeight: '600', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💡 Bấm để điền nhanh tài khoản thử nghiệm:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div
                onClick={() => fillSampleAccount('admin', '123')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ padding: '0.15rem 0.4rem', background: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>ADMIN</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>admin</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '500' }}>➜ /admin</span>
              </div>

              <div
                onClick={() => fillSampleAccount('user', '123')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ padding: '0.15rem 0.4rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>USER</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>user</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '500' }}>➜ /shop</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}