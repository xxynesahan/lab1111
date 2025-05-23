import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setUser(response.data);
        setFormData({
          login: response.data.login,
          password: response.data.password,
          role: response.data.role
        });
      } catch (error) {
        let errorMessage = 'Ошибка загрузки данных пользователя';
        
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage = 'Неверный запрос';
          } else if (error.response.status === 401) {
            errorMessage = 'Ошибка авторизации';
            navigate('/login');
          } else if (error.response.status === 404) {
            errorMessage = 'Страница не найдена';
          } else if (error.response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`http://localhost:5000/users/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      alert("Данные успешно обновлены!");
      navigate('/');
    } catch (error) {
      let errorMessage = 'Ошибка при обновлении данных';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Неверные данные для обновления';
        } else if (error.response.status === 401) {
          errorMessage = 'Ошибка авторизации';
          navigate('/login');
        } else if (error.response.status === 404) {
          errorMessage = 'Пользователь не найден';
        } else if (error.response.status === 500) {
          errorMessage = 'Ошибка сервера при обновлении';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container">
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="error-message">{error}</div>
      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        Вернуться на главную
      </button>
    </div>
  );

  if (!user) return null;

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="text-center">Редактирование пользователя</h1>
        
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
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Сохранение...
                </>
              ) : 'Сохранить изменения'}
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

export default UserDetail;