export default function ContactPage() {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#0f172a' }}>📬 Trợ giúp & Liên hệ</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155' }}>Họ và tên</label>
          <input type="text" placeholder="Nhập tên của bạn" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155' }}>Nội dung tin nhắn</label>
          <textarea rows={4} placeholder="Nhập nội dung cần hỗ trợ..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}></textarea>
        </div>
        <button type="button" style={{ background: '#2563eb', color: '#fff', padding: '0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Gửi tin nhắn
        </button>
      </form>
    </div>
  );
}