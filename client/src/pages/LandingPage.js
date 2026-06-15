import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container header-content">
          <h1>Não Vá Que É Barril</h1>
          <p>Avaliação Contextualizada de Docentes</p>
        </div>
      </header>

      <main className="container main-content">
        <section className="hero">
          <h2>Bem-vindo ao sistema de avaliação de professores</h2>
          <p>
            Uma plataforma colaborativa para avaliar professores dentro do contexto de cada disciplina,
            garantindo análises precisas e imparciais.
          </p>
        </section>

        <section className="features">
          <h3>Funcionalidades Principais</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Avaliações Contextualizadas</h4>
              <p>Avalie professores especificamente para cada disciplina que ministram.</p>
            </div>
            <div className="feature-card">
              <h4>Segurança Acadêmica</h4>
              <p>Acesso restrito apenas para estudantes com e-mail institucional.</p>
            </div>
            <div className="feature-card">
              <h4>Análises Detalhadas</h4>
              <p>Métricas de didática, dificuldade, carisma e flexibilidade.</p>
            </div>
            <div className="feature-card">
              <h4>Comunidade Respeitosa</h4>
              <p>Opção de anonimato e moderação comunitária.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h3>Comece Agora</h3>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Entrar
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Registrar-se
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Não Vá Que É Barril - UFBA Instituto de Computação</p>
      </footer>
    </div>
  );
}
