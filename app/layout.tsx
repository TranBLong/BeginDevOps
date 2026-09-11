import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc' }}>
        <nav style={{ background: '#0f172a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>⚡ TechStore</Link>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>🛒 Cửa hàng</Link>
            <Link href="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🔐 Đăng nhập</Link>
            <Link href="/register" style={{ color: '#cbd5e1', textDecoration: 'none' }}>📝 Đăng ký</Link>
            <Link href="/user" style={{ color: '#cbd5e1', textDecoration: 'none' }}>👤 User</Link>
            <Link href="/admin" style={{ color: '#f43f5e', textDecoration: 'none', fontWeight: 'bold' }}>🛡️ Admin</Link>
          </div>
        </nav>
        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}