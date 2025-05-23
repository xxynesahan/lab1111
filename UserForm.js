import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: 'Сотрудник'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/users', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      alert('Пользователь успешно добавлен!');
      navigate('/');
    } catch (error) {
      let errorMessage = 'Произошла ошибка при добавлении пользователя';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Неверный запрос. Проверьте введенные данные.';
        } else if (error.response.status === 401) {
          errorMessage = 'Ошибка авторизации. Пожалуйста, войдите в систему.';
          navigate('/login');
        } else if (error.response.status === 404) {
          errorMessage = 'Страница не найдена.';
        } else if (error.response.status === 500) {
          errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="text-center">Добавление нового пользователя</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин:</label>
            <input
              type="text"
              name="login"
              className="form-control"
              value={formData.login}
              onChange={handleChange}
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Роль:</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Администратор">Администратор</option>
              <option value="Сотрудник">Сотрудник</option>
            </select>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Отправка...
                </>
              ) : 'Добавить пользователя'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;