import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout.jsx';

import Dashboard from './pages/Dashboard.jsx';

import TaskList from './pages/TaskList.jsx';

import Categories from './pages/Categories.jsx';

// We will build these pages next
const NotFound = () => <div className="page-container"><h2>404 - Page Not Found</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="categories" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
