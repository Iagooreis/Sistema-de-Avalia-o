import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

export default function SearchDiscipline() {
  const navigate = useNavigate();
  const [codigoDisciplina, setCodigoDisciplina] = useState('');
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [disciplinaNome, setDisciplinaNome] = useState('');

  const calcularMedia = (professor) => {
    const notas = [professor.didatica, professor.dificuldade, professor.carisma, professor.flexibilidade];
    const notasValidas = notas.filter((n) => n !== undefined && n !== null);
    if (notasValidas.length === 0) return 0;
    return (notasValidas.reduce((a, b) => Number(a) + Number(b), 0) / notasValidas.length).toFixed(1);
  };

  const formatNota = (valor) => {
    if (valor === undefined || valor === null) return '-';
    return Number(valor).toFixed(1);
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!codigoDisciplina.trim()) {
      setErro('Por favor, digite o código da disciplina (ex: MATA37).');
      return;
    }

    setLoading(true);
    setErro(null);
    setProfessores([]);

    try {
      const response = await api.get(`/disciplinas/codigo/${codigoDisciplina.toUpperCase()}/professores`);

      if (response.data && response.data.length > 0) {
        setProfessores(response.data);
        setDisciplinaNome(response.data[0].disciplina_nome || codigoDisciplina.toUpperCase());
      } else {
        setErro('Nenhum professor encontrado para esta disciplina.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErro('Disciplina não encontrada. Tente: MATA37, MATA56 ou MATA65.');
      } else {
        setErro(err.response?.data?.message || 'Erro ao buscar professores. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>🔍 Buscar Professores por Disciplina</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main">
        <section className="dashboard-section">
          {/* Formulário */}
          <form onSubmit={handleBuscar} style={{ marginBottom: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="codigo" style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#333' }}>
                Código da Disciplina:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  id="codigo"
                  type="text"
                  placeholder="Digite o código (ex: MATA37)"
                  value={codigoDisciplina}
                  onChange={(e) => setCodigoDisciplina(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1em',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 32px',
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              <small style={{ display: 'block', marginTop: '8px', color: '#999', fontSize: '0.9em' }}>
                Exemplos: MATA37 (Lógica), MATA56 (Cálculo A), MATA65 (BD)
              </small>
            </div>
          </form>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                border: '4px solid #e0e0e0',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}></div>
              <p style={{ color: '#666' }}>Carregando professores...</p>
            </div>
          )}

          {/* Erro */}
          {erro && (
            <div style={{
              background: '#ffebee',
              border: '2px solid #f44336',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0', fontSize: '1.1em' }}>⚠️ Erro</h3>
              <p style={{ color: '#c62828', margin: 0 }}>{erro}</p>
            </div>
          )}

          {/* Resultados */}
          {professores.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '1.5em',
                color: '#333',
                marginBottom: '30px',
                textAlign: 'center',
                paddingBottom: '15px',
                borderBottom: '2px solid #667eea',
              }}>
                📚 {disciplinaNome}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {professores.map((professor) => {
                  const mediaValue = Number.isFinite(Number(professor.media))
                    ? Number(professor.media)
                    : Number(calcularMedia(professor));
                  const media = Number.isFinite(mediaValue) ? mediaValue.toFixed(1) : '0.0';
                  const cor = mediaValue >= 7 ? '#4caf50' : mediaValue >= 5 ? '#ff9800' : '#f44336';

                  return (
                    <div
                      key={professor.id}
                      style={{
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)',
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/professores/${professor.professor_id}/disciplinas/${codigoDisciplina.toUpperCase()}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)';
                        e.currentTarget.style.borderColor = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '20px',
                        textAlign: 'center',
                      }}>
                        <h3 style={{ fontSize: '1.2em', margin: 0, fontWeight: '600' }}>
                          {professor.nome}
                        </h3>
                        <p style={{ margin: '8px 0 0', fontSize: '0.95em', opacity: 0.85 }}>
                          Clique para ver detalhes e comentários
                        </p>
                      </div>
 
                      {/* Conteúdo */}
                      <div style={{ padding: '25px', flex: 1 }}>
                        {/* Média */}
                        <div style={{
                          textAlign: 'center',
                          marginBottom: '25px',
                          padding: '20px',
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          borderRadius: '8px',
                        }}>
                          <span style={{ display: 'block', fontSize: '0.95em', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
                            Nota Média
                          </span>
                          <span style={{
                            display: 'block',
                            fontSize: '2.5em',
                            fontWeight: '700',
                            color: cor,
                          }}>
                            {media}
                          </span>
                        </div>

                        {/* Detalhes */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}>
                          <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center',
                          }}>
                            <span style={{ display: 'block', fontSize: '0.85em', color: '#999', marginBottom: '4px', fontWeight: '500' }}>
                              Didática
                            </span>
                            <span style={{ display: 'block', fontSize: '1.2em', color: '#667eea', fontWeight: '600' }}>
                              {formatNota(professor.didatica)}
                            </span>
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center',
                          }}>
                            <span style={{ display: 'block', fontSize: '0.85em', color: '#999', marginBottom: '4px', fontWeight: '500' }}>
                              Dificuldade
                            </span>
                            <span style={{ display: 'block', fontSize: '1.2em', color: '#667eea', fontWeight: '600' }}>
                              {formatNota(professor.dificuldade)}
                            </span>
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center',
                          }}>
                            <span style={{ display: 'block', fontSize: '0.85em', color: '#999', marginBottom: '4px', fontWeight: '500' }}>
                              Carisma
                            </span>
                            <span style={{ display: 'block', fontSize: '1.2em', color: '#667eea', fontWeight: '600' }}>
                              {formatNota(professor.carisma)}
                            </span>
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center',
                          }}>
                            <span style={{ display: 'block', fontSize: '0.85em', color: '#999', marginBottom: '4px', fontWeight: '500' }}>
                              Flexibilidade
                            </span>
                            <span style={{ display: 'block', fontSize: '1.2em', color: '#667eea', fontWeight: '600' }}>
                              {formatNota(professor.flexibilidade)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {!loading && professores.length === 0 && !erro && codigoDisciplina && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>Nenhum resultado encontrado.</p>
            </div>
          )}

          {!loading && professores.length === 0 && !erro && !codigoDisciplina && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#999' }}>
              <p>👋 Digite um código de disciplina e clique em "Buscar" para visualizar os professores!</p>
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
