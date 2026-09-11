'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu User để khắc phục lỗi "Unexpected any"
interface User {
  id?: number;
  username: string;
  password?: string;
  role?: string;
  status?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Lấy danh sách tài khoản đồng bộ với Admin Panel (key: app_users)
    const users: User[] = JSON.parse(localStorage.getItem('app_users') || '[]');

    const foundUser = users.find(
      (u: User) => u.username === username && u.password === password
    );

    if (!foundUser) {
      setError('Tài khoản hoặc mật khẩu không chính xác!');
      return;
    }

    // 🛑 KIỂM TRA TRẠNG THÁI BỊ KHÓA
    if (foundUser.status === 'Tạm khóa') {
      setError('Tài khoản của bạn đã bị khóa! Vui lòng liên hệ Admin.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ 
      id: foundUser.id, 
      username: foundUser.username, 
      role: foundUser.role 
    }));

    if (foundUser.role === 'admin') router.push('/admin');
    else router.push('/shop');
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', color: '#0f172a' }}>🔐 Đăng Nhập</h2>
      {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Tên đăng nhập (admin / user)" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="password" placeholder="Mật khẩu (123456)" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng nhập</button>
      </form>
    </div>
  );
}