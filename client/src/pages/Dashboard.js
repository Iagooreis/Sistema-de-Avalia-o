import React from 'react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Não Vá Que É Barril - Dashboard</h1>
          <div className="header-right">
            <span>Bem-vindo, {user.nome}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section">
          <h2>Funcionalidades</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Buscar por Disciplina</h3>
              <p>Encontre professores por disciplina específica.</p>
              <button className="btn btn-primary">Explorar</button>
            </div>
            <div className="feature-card">
              <h3>Buscar por Professor</h3>
              <p>Veja todas as disciplinas de um professor.</p>
              <button className="btn btn-primary">Explorar</button>
            </div>
            <div className="feature-card">
              <h3>Avaliar Professor</h3>
              <p>Deixe sua avaliação sobre um professor.</p>
              <button className="btn btn-primary">Avaliar</button>
            </div>
            <div className="feature-card">
              <h3>Meu Perfil</h3>
              <p>Gerencie suas informações e avaliações.</p>
              <button className="btn btn-primary">Ver Perfil</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
