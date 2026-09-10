export default function SettingsPage() {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>⚙️ Cài đặt Hệ thống</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Thông báo email</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Nhận thông báo khi build thành công hoặc bị lỗi</div>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Tự động Deploy</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Kích hoạt quy trình CD tự động khi git push lên branch main</div>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
    </div>
  );
}