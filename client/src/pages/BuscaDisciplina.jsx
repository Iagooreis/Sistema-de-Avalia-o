import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/BuscaDisciplina.css';

export default function BuscaDisciplina() {
  const navigate = useNavigate();
  const [disciplinaId, setDisciplinaId] = useState('');
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    
    if (!disciplinaId.trim()) {
      setError('Por favor, digite o código da disciplina (ex: MATA37).');
      return;
    }

    setLoading(true);
    setError(null);
    setProfessores([]);

    try {
      const response = await api.get(`/disciplinas/codigo/${disciplinaId.toUpperCase()}/professores`);
      
      if (response.data && response.data.length > 0) {
        setProfessores(response.data);
        setDisciplinaNome(response.data[0].disciplina_nome || `${disciplinaId.toUpperCase()}`);
      } else {
        setError('Nenhum professor encontrado para esta disciplina.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Disciplina não encontrada. Tente com um código válido (ex: MATA37, MATA56, MATA65).');
      } else {
        setError(err.response?.data?.message || 'Erro ao buscar professores. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="busca-disciplina">
      <header className="busca-header">
        <div className="container header-content">
          <h1>🔍 Buscar Professores por Disciplina</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container busca-main">
        <section className="busca-section">
          {/* Formulário de Busca */}
          <form onSubmit={handleBuscar} className="busca-form">
            <div className="form-group">
              <label htmlFor="disciplina-id">Código da Disciplina:</label>
              <div className="input-group">
                <input
                  id="disciplina-id"
                  type="text"
                  placeholder="Digite o código da disciplina (ex: MATA37)"
                  value={disciplinaId}
                  onChange={(e) => setDisciplinaId(e.target.value.toUpperCase())}
                  className="input-field"
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              <small className="input-hint">Ex: MATA37 (Lógica), MATA56 (Cálculo A), MATA65 (BD)</small>
            </div>
          </form>

          {/* Estado de Carregamento */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando professores...</p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="error-state">
              <h3>⚠️ Erro</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Cards de Professores */}
          {professores.length > 0 && (
            <div className="resultados">
              <h2 className="disciplina-title">
                📚 {disciplinaNome}
              </h2>
              <div className="professores-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professores.map((professor) => {
                  const mediaValue = Number.isFinite(Number(professor.media))
                    ? Number(professor.media)
                    : Number(calcularMedia(professor));
                  const media = Number.isFinite(mediaValue) ? mediaValue.toFixed(1) : '0.0';
                  return (
                    <div
                      key={professor.id}
                      className="professor-card flex flex-col h-full w-full"
                      onClick={() => navigate(`/professores/${professor.professor_id}/disciplinas/${disciplinaId.toUpperCase()}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="professor-header">
                        <h3 className="professor-nome">{professor.nome}</h3>
                        <p style={{ margin: '8px 0 0', fontSize: '0.95em', color: '#666' }}>
                          Clique para ver detalhes e comentários
                        </p>
                      </div>

                      <div className="professor-content">
                        <div className="media-container">
                          <span className="media-label">Nota Média</span>
                          <span className={`media-valor ${mediaValue >= 7 ? 'excelente' : mediaValue >= 5 ? 'bom' : 'baixo'}`}>
                            {media}
                          </span>
                        </div>

                        <div className="detalhes-notas">
                          <div className="nota-item">
                            <span className="nota-label">Didática:</span>
                            <span className="nota-valor">{formatNota(professor.didatica)}</span>
                          </div>
                          <div className="nota-item">
                            <span className="nota-label">Dificuldade:</span>
                            <span className="nota-valor">{formatNota(professor.dificuldade)}</span>
                          </div>
                          <div className="nota-item">
                            <span className="nota-label">Carisma:</span>
                            <span className="nota-valor">{formatNota(professor.carisma)}</span>
                          </div>
                          <div className="nota-item">
                            <span className="nota-label">Flexibilidade:</span>
                            <span className="nota-valor">{formatNota(professor.flexibilidade)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado Vazio (depois de busca com resultado) */}
          {!loading && professores.length === 0 && !error && disciplinaId && (
            <div className="empty-state">
              <p>Digite um código e clique em "Buscar" para ver os professores.</p>
            </div>
          )}

          {!loading && professores.length === 0 && !error && !disciplinaId && (
            <div className="initial-state">
              <p>👋 Comece digitando o ID de uma disciplina para visualizar os professores!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
