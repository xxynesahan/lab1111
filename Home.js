import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        setUsers(response.data);
      } catch (err) {
        let errorMessage = err.message;
        
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Ошибка авторизации. Пожалуйста, войдите в систему.';
            navigate('/login');
          } else if (err.response.status === 400) {
            errorMessage = "Неправильный запрос"
          } else if (err.response.status === 404) {
            errorMessage = 'Страница не найдена';
          } else if (err.response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [authToken, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      let errorMessage = 'Ошибка удаления';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Ошибка авторизации при удалении';
          navigate('/login');
        } else if (err.response.status === 404) {
          errorMessage = 'Пользователь для удаления не найден';
        } else if (err.response.status === 500) {
          errorMessage = 'Ошибка сервера при удалении';
        }
      }
      
      alert(errorMessage);
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
      <button className="btn btn-secondary" onClick={() => window.location.reload()}>
        Попробовать снова
      </button>
    </div>
  );

  return (
    <div className="container">
      <div className="header-with-logout">
        <h1>Управление доступом</h1>
        <button 
          className="btn btn-logout"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Выйти
        </button>
      </div>
      
      <div className="user-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.login}</h3>
            <p>Роль: {user.role}</p>
            <div className="actions">
              <Link to={`/users/${user.id}`} className="btn edit-btn">
                Редактировать
              </Link>
              <button 
                onClick={() => handleDelete(user.id)} 
                className="btn delete-btn"
                disabled={loading}
              >
                {loading ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/add-users" className="btn add-btn">
        Добавить пользователя
      </Link>
    </div>
  );
};

export default Home;
