import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinhasAvaliacoes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/avaliacoes/minhas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvaliacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinhasAvaliacoes();
  }, []);

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
            {loading ? (
              <p style={{ color: '#666', marginTop: '10px' }}>Carregando avaliações...</p>
            ) : avaliacoes.length === 0 ? (
              <p style={{ color: '#666', marginTop: '10px' }}>Você ainda não avaliou nenhum professor/disciplina.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px', textAlign: 'left' }}>
                {avaliacoes.map(av => (
                  <div key={av.id} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>
                      {av.professor_nome}
                    </h4>
                    <p style={{ margin: '5px 0', color: '#555' }}><strong>Disciplina:</strong> {av.disciplina_codigo} ({av.semestre})</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', fontSize: '0.9em' }}>
                      <p style={{ margin: 0 }}><strong>Didática:</strong> {av.didatica}/10</p>
                      <p style={{ margin: 0 }}><strong>Dificuldade:</strong> {av.dificuldade}/10</p>
                      <p style={{ margin: 0 }}><strong>Carisma:</strong> {av.carisma}/10</p>
                      <p style={{ margin: 0 }}><strong>Flexibilidade:</strong> {av.flexibilidade}/10</p>
                    </div>

                    {av.comentario && (
                      <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.9em', color: '#666' }}>
                        "{av.comentario}"
                      </div>
                    )}
                    
                    <p style={{ marginTop: '15px', fontSize: '0.8em', color: '#999' }}>
                      Realizada em: {new Date(av.created_at).toLocaleDateString('pt-BR')}
                      {av.anonimo ? ' • (Anônima)' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
