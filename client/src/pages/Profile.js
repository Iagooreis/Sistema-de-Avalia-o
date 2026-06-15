import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Meu Perfil</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section">
          <h2>Informações Pessoais</h2>
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Nome:</strong>
              <p>{user.nome || 'Não carregado'}</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>E-mail:</strong>
              <p>{user.email || 'Não carregado'}</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Status:</strong>
              <p>✅ Conta Ativa</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h3>📊 Minhas Avaliações</h3>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Esta seção estará disponível na <strong>Sprint 2</strong>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
