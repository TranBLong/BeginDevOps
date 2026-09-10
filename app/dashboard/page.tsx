export default function DashboardPage() {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>📊 Bảng điều khiển (Dashboard)</h1>
      <p style={{ color: '#64748b' }}>Trạng thái tài nguyên máy chủ hiện tại:</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#16a34a' }}>🟢 Active</h3>
          <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Server Status</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#2563eb' }}>12%</h3>
          <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>CPU Usage</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#9333ea' }}>210 MB</h3>
          <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Memory RAM</p>
        </div>
      </div>
    </div>
  );
}