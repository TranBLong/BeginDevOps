export default function HomePage() {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>🚀 Chào mừng đến với Ứng dụng BeginDevOps</h1>
      <p style={{ color: '#475569' }}>
        Đây là trang chủ của dự án Next.js demo phục vụ thử nghiệm quy trình CI/CD tự động bằng Docker, GitHub Actions và Render.
      </p>
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e0f2fe', borderRadius: '6px', color: '#0369a1' }}>
        💡 Hãy thử bấm vào các trang trên menu để di chuyển giữa các màn hình!
      </div>
    </div>
  );
}