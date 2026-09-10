import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f1f5f9' }}>
        {/* Thanh Navigation bar */}
        <nav style={{ background: '#0f172a', padding: '1rem 2rem', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>DevOps App</span>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Trang chủ</Link>
          <Link href="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Giới thiệu</Link>
          <Link href="/projects" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dự án</Link>
          <Link href="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Liên hệ</Link>
          <Link href="/settings" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Cài đặt</Link>
        </nav>

        {/* Nội dung các màn hình sẽ render ở đây */}
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}