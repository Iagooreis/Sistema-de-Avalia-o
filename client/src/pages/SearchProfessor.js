import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function SearchProfessor() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Buscar por Professor</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>🔨 Em Desenvolvimento</h2>
          <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
            Esta funcionalidade estará disponível na <strong>Sprint 2</strong>.
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Você poderá buscar professores e ver todas as suas disciplinas em breve!
          </p>
        </section>
      </main>
    </div>
  );
}
