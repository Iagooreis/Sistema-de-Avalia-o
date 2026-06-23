import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

export default function ProfessorDetail() {
  const navigate = useNavigate();
  const { id, codigo } = useParams();
  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/professores/${id}/disciplinas/${codigo}`);
        setDetalhes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar detalhes do professor.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, codigo]);

  const formatNota = (valor) => {
    if (valor === undefined || valor === null) return '-';
    return Number(valor).toFixed(1);
  };

  const formatData = (valor) => {
    if (!valor) return '';
    const date = new Date(valor);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Detalhes do Professor</h1>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section professor-detail-container">
          {loading && <p>Carregando informações...</p>}

          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #f44336', borderRadius: '8px', padding: '20px' }}>
              <p style={{ margin: 0, color: '#c62828' }}>{error}</p>
            </div>
          )}

          {detalhes && !loading && !error && (
            <>
              <div className="professor-detail-grid lg:grid-cols-12 gap-8">
                <aside className="detail-sidebar lg:col-span-4">
                  <div className="detail-card detail-card-primary">
                    <div className="profile-hero">
                      <div className="profile-avatar">
                        {detalhes.foto ? (
                          <img src={detalhes.foto} alt={`Foto de ${detalhes.professor_nome}`} />
                        ) : (
                          <div className="avatar-placeholder">
                            {detalhes.professor_nome
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2>{detalhes.professor_nome}</h2>
                        <p className="detail-subtitle">{detalhes.disciplina_codigo} — {detalhes.disciplina_nome}</p>
                      </div>
                    </div>

                    <div className="detail-score-card">
                      <span className="score-label">Nota Média</span>
                      <strong className="score-value">{formatNota(detalhes.media)}</strong>
                    </div>
                  </div>
                </aside>

                <section className="detail-main lg:col-span-8">
                  <div className="metrics-grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="detail-card detail-card-metric">
                      <h3>Didática</h3>
                      <p>{formatNota(detalhes.didatica)}</p>
                    </div>
                    <div className="detail-card detail-card-metric">
                      <h3>Dificuldade</h3>
                      <p>{formatNota(detalhes.dificuldade)}</p>
                    </div>
                    <div className="detail-card detail-card-metric">
                      <h3>Carisma</h3>
                      <p>{formatNota(detalhes.carisma)}</p>
                    </div>
                    <div className="detail-card detail-card-metric">
                      <h3>Flexibilidade</h3>
                      <p>{formatNota(detalhes.flexibilidade)}</p>
                    </div>
                  </div>

                  <div className="comments-section">
                    <div className="detail-card detail-card-comments">
                      <div className="comments-header">
                        <h3>Comentários dos Alunos</h3>
                      </div>
                      {detalhes.comentarios.length === 0 ? (
                        <p className="empty-text">Nenhum comentário disponível para esta relação de professor e disciplina.</p>
                      ) : (
                        <div className="comments-list">
                          {detalhes.comentarios.map((comentario, index) => (
                            <div key={index} className="comment-card">
                              <p>{comentario.texto}</p>
                              <span className="comment-date">{formatData(comentario.data)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
