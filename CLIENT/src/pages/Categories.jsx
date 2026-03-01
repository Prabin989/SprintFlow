import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import CategoryForm from '../components/forms/CategoryForm.jsx';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will fail if tasks belong to this category.')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCategories();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    const handleOpenForm = (category = null) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    const handleSaveSuccess = () => {
        handleCloseForm();
        fetchCategories();
    };

    if (isLoading && categories.length === 0) return <Spinner />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2>Categories</h2>
                    <p>Organize your tasks into custom workspaces</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenForm()}>
                    <FiPlus /> New Category
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="category-list">
                {categories.map(cat => (
                    <div key={cat.id} className="category-item">
                        <div className="category-info">
                            <span
                                className="category-color-dot"
                                style={{ backgroundColor: cat.color }}
                            ></span>
                            <span className="category-name">{cat.name}</span>
                        </div>
                        <div className="category-actions">
                            <button
                                className="icon-btn edit-btn"
                                title="Edit Category"
                                onClick={() => handleOpenForm(cat)}
                            >
                                <FiEdit2 />
                            </button>
                            <button
                                className="icon-btn delete-btn"
                                title="Delete Category"
                                onClick={() => handleDelete(cat.id)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && !isLoading && (
                    <div className="empty-state">No categories found. Create one to get started!</div>
                )}
            </div>

            {isFormOpen && (
                <CategoryForm
                    category={editingCategory}
                    onSave={handleSaveSuccess}
                    onCancel={handleCloseForm}
                />
            )}
        </div>
    );
}

export default Categories;
