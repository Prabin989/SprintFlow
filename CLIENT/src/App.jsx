import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header';
import TaskBoard from './components/board/TaskBoard';
import Spinner from './components/common/Spinner';

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Ensure the API is running on http://localhost:3000');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {error && <div className="error-banner">{error}</div>}
        <TaskBoard tasks={tasks} />
      </main>
      {isLoading && <Spinner />}
    </div>
  );
}

export default App;
