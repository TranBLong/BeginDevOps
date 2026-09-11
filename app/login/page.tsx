'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu User để khắc phục lỗi "Unexpected any"
interface User {
  username: string;
  password?: string;
  role?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra tài khoản admin mặc định
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('currentUser', JSON.stringify({ username: 'admin', role: 'admin' }));
      router.push('/admin');
      return;
    }

    // Lấy danh sách user từ localStorage với định kiểu User[]
    const savedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Thay (u: any) bằng (u: User)
    const foundUser = savedUsers.find(
      (u: User) => u.username === username && u.password === password
    );

    if (foundUser || (username === 'user' && password === '123456')) {
      const userInfo = foundUser || { username: 'user', role: 'user' };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      router.push('/user');
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', color: '#0f172a' }}>🔐 Đăng Nhập</h2>
      {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Tên đăng nhập (admin / user)" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="password" placeholder="Mật khẩu (123456)" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng nhập</button>
      </form>
    </div>
  );
}