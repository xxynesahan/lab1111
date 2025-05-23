import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Удаление пользователя
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="container">
      <h1>Управление доступом</h1>
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
              >
                Удалить
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