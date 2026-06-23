import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

export default function SearchProfessor() {
  const navigate = useNavigate();
  const [professoresLista, setProfessoresLista] = useState([]);
  const [professorId, setProfessorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessores = async () => {
      setLoading(true);
      try {
        const response = await api.get('/professores');
        setProfessoresLista(response.data || []);
      } catch (err) {
        setError('Erro ao carregar lista de professores. Atualize a página.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessores();
  }, []);

  const handleBuscar = (event) => {
    event.preventDefault();

    if (!professorId) {
      setError('Por favor, selecione um professor antes de buscar.');
      return;
    }

    setError(null);
    navigate(`/professores/${professorId}/perfil`);
  };

  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 0' }}>
      <header className="dashboard-header">
        <div className="container header-content">
          <h1>Buscar por Professor</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="container dashboard-main" style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
        <section className="dashboard-section" style={{ width: '100%', maxWidth: '720px' }}>
          <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)', padding: '36px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.9rem', marginBottom: '16px', color: '#111827' }}>Selecione o Professor</h2>
            <p style={{ color: '#6b7280', marginBottom: '28px' }}>
              Escolha um professor para visualizar o perfil completo com notas e disciplinas.
            </p>

            <form onSubmit={handleBuscar}>
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="professor-select" style={{ display: 'block', marginBottom: '10px', color: '#374151', fontWeight: 600 }}>
                  Professor
                </label>
                <select
                  id="professor-select"
                  value={professorId}
                  onChange={(e) => setProfessorId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    color: '#111827',
                    fontSize: '1rem',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                >
                  <option value="" disabled>
                    Selecione um professor...
                  </option>
                  {professoresLista.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.nome}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '14px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: loading ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  fontWeight: 700,
                  border: 'none',
                  fontSize: '1rem',
                  transition: 'background 0.2s ease',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = '#3b82f6';
                }}
              >
                {loading ? 'Carregando...' : 'Buscar'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
