import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

export default function PerfilProfessor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/professores/${id}/perfil`);
        setProfessor(response.data);
        setSelectedIndex(0);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar perfil do professor.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [id]);

  const formatNota = (valor) => {
    if (valor === undefined || valor === null) return '-';
    return Number(valor).toFixed(1);
  };

  const formatData = (valor) => {
    if (!valor) return '';
    const date = new Date(valor);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const disciplinas = professor?.disciplinas || [];
  const selectedDisciplina = disciplinas[selectedIndex] || null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Perfil do Professor</h1>
          <button onClick={() => navigate('/search-professor')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section">
          {loading && <p>Carregando perfil...</p>}

          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #f44336', borderRadius: '8px', padding: '20px' }}>
              <p style={{ margin: 0, color: '#c62828' }}>{error}</p>
            </div>
          )}

          {!loading && !error && professor && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', color: '#222' }}>{professor.nome}</h2>
                <p style={{ margin: 0, color: '#555' }}>
                  {professor.departamento || 'Departamento não informado'} • {professor.email || 'sem e-mail'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '30px' }}>
                {disciplinas.map((disciplina, index) => (
                  <button
                    key={disciplina.professor_disciplina_id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '999px',
                      border: selectedIndex === index ? '2px solid #4f46e5' : '1px solid #d1d5db',
                      background: selectedIndex === index ? '#eef2ff' : '#fff',
                      cursor: 'pointer',
                      fontWeight: selectedIndex === index ? '700' : '500',
                      color: selectedIndex === index ? '#312e81' : '#374151',
                    }}
                  >
                    {disciplina.disciplina_nome}
                  </button>
                ))}
              </div>

              {!selectedDisciplina && (
                <div style={{ padding: '24px', borderRadius: '14px', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <p style={{ margin: 0, color: '#555' }}>Nenhuma disciplina encontrada para este professor.</p>
                </div>
              )}

              {selectedDisciplina && (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '18px',
                    marginBottom: '30px',
                  }}>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Disciplina</p>
                      <h3 style={{ margin: 0, color: '#111' }}>{selectedDisciplina.disciplina_nome}</h3>
                      <span style={{ display: 'block', marginTop: '10px', color: '#4b5563' }}>{selectedDisciplina.disciplina_codigo}</span>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Semestre</p>
                      <h3 style={{ margin: 0, color: '#111' }}>{selectedDisciplina.semestre || 'Não informado'}</h3>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Nota Média</p>
                      <h3 style={{ margin: 0, color: '#16a34a' }}>{formatNota(selectedDisciplina.media)}</h3>
                    </div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 18px 0', color: '#111' }}>Comentários dos Alunos</h3>
                    {selectedDisciplina.comentarios.length === 0 ? (
                      <p style={{ color: '#6b7280' }}>Nenhum comentário encontrado para esta disciplina.</p>
                    ) : (
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {selectedDisciplina.comentarios.map((comentario, index) => (
                          <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
                            <p style={{ margin: '0 0 12px 0', color: '#374151' }}>{comentario.texto}</p>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95em' }}>{formatData(comentario.data)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
