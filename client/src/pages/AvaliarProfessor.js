import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AvaliarProfessor.css';

const AvaliarProfessor = () => {
  const navigate = useNavigate();
  const [contextos, setContextos] = useState([]);
  const [formData, setFormData] = useState({
    professor_disciplina_id: '',
    didatica: 5,
    dificuldade: 5,
    carisma: 5,
    flexibilidade: 5,
    comentario: '',
    anonimo: true
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    // Busca contextos (Professor + Disciplina)
    const fetchContextos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/avaliacoes/contextos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContextos(response.data);
      } catch (error) {
        console.error('Erro ao carregar contextos:', error.response?.data || error.message);
        setContextos([]);
        setLoadError('Não foi possível carregar os contextos de avaliação. Atualize a página ou tente novamente mais tarde.');
      }
    };
    fetchContextos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.professor_disciplina_id) {
      setStatus({ type: 'danger', message: 'Selecione o professor e disciplina antes de enviar.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/avaliacoes', {
        ...formData,
        professor_disciplina_id: Number(formData.professor_disciplina_id),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Avaliação enviada com sucesso!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
      setStatus({ type: 'danger', message: 'Erro ao enviar a avaliação. Tente novamente.' });
    }
  };

  const criterios = ['didatica', 'dificuldade', 'carisma', 'flexibilidade'];

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-card">
        <h2>Avaliar Professor</h2>
        <p>Sua avaliação ajuda outros estudantes. {formData.anonimo && 'Seu envio será anônimo.'}</p>
        
        {status.message && (
          <div className={`alert alert-${status.type}`}>{status.message}</div>
        )}

        <form onSubmit={handleSubmit} className="avaliacao-form">
          <div className="form-group">
            <label>Contexto (Professor e Disciplina)</label>
            <select name="professor_disciplina_id" value={formData.professor_disciplina_id} onChange={handleChange} required>
              <option value="" disabled>
                Selecione a disciplina...
              </option>
              {contextos.map((ctx) => (
                <option key={ctx.id} value={ctx.id}>
                  {ctx.professor_nome} - {ctx.disciplina_codigo} ({ctx.semestre})
                </option>
              ))}
            </select>
            {loadError && (
              <p style={{ marginTop: '10px', color: '#b91c1c' }}>{loadError}</p>
            )}
          </div>

          {criterios.map(criterio => (
            <div className="form-group range-group" key={criterio}>
              <label>{criterio.charAt(0).toUpperCase() + criterio.slice(1)}: <span className="range-badge">{formData[criterio]}</span></label>
              <input type="range" name={criterio} min="1" max="10" value={formData[criterio]} onChange={handleChange} />
              <div className="range-labels">
                <span>1 (Muito Ruim)</span>
                <span>10 (Excelente)</span>
              </div>
            </div>
          ))}

          <div className="form-group">
            <label>Comentário (Opcional)</label>
            <textarea name="comentario" rows="3" value={formData.comentario} onChange={handleChange} placeholder="Como foi sua experiência com este docente nesta matéria?"></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="anonimo" checked={formData.anonimo} onChange={handleChange} />
              Manter minha identidade anônima
            </label>
          </div>

          <button type="submit" className="btn-primary">Enviar Avaliação</button>
        </form>
      </div>
    </div>
  );
};

export default AvaliarProfessor;