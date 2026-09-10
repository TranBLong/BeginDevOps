export default function AboutPage() {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>📄 Trang Giới thiệu (About)</h1>
      <p style={{ color: '#475569' }}>
        Dự án này được thiết lập nhằm thực hành các kỹ năng trong lộ trình DevOps:
      </p>
      <ul style={{ color: '#334155', lineHeight: '1.8' }}>
        <li>Đóng gói ứng dụng web với <strong>Docker Multi-stage build</strong>.</li>
        <li>Tự động hóa xây dựng và kiểm thử qua <strong>GitHub Actions</strong>.</li>
        <li>Triển khai ứng dụng lên nền tảng đám mây <strong>Render</strong>.</li>
      </ul>
    </div>
  );
}