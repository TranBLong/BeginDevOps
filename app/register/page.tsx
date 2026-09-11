'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu để loại bỏ lỗi "Unexpected any"
interface User {
  username: string;
  password?: string;
  role?: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Thay thế (u: any) bằng (u: User)
    if (existingUsers.some((u: User) => u.username === username)) {
      alert('Tên tài khoản này đã tồn tại!');
      return;
    }

    const newUser: User = { username, password, role: 'user' };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('Đăng ký thành công! Hãy đăng nhập.');
    router.push('/login');
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', color: '#0f172a' }}>📝 Đăng ký Tài khoản</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Tên đăng nhập mới" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ background: '#16a34a', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Tạo tài khoản</button>
      </form>
    </div>
  );
}