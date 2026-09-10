export default function ProjectsPage() {
  const projects = [
    { title: 'Dự án Next.js Docker', status: 'Hoàn thành', color: '#16a34a' },
    { title: 'Pipeline GitHub Actions CI/CD', status: 'Hoàn thành', color: '#16a34a' },
    { title: 'Tích hợp Database PostgreSQL', status: 'Đang phát triển', color: '#d97706' },
  ];

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>📁 Quản lý Dự án (Projects)</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {projects.map((p, index) => (
          <div key={index} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{p.title}</span>
            <span style={{ color: p.color, fontWeight: 'bold', fontSize: '0.9rem' }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}