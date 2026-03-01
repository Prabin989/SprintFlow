import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import CategoryForm from '../components/forms/CategoryForm.jsx';
import DeleteConfirmation from '../components/common/DeleteConfirmation.jsx';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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

    const handleDeleteClick = (category) => {
        setDeleteError(null);
        setDeletingCategory(category);
    };

    const confirmDelete = async () => {
        if (!deletingCategory) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const response = await fetch(`http://localhost:3000/api/categories/${deletingCategory.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDeletingCategory(null);
                fetchCategories();
            } else {
                const data = await response.json();
                setDeleteError(data.error || 'Failed to delete category');
            }
        } catch (err) {
            setDeleteError('Network error: Failed to delete category');
        } finally {
            setIsDeleting(false);
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
                                onClick={() => handleDeleteClick(cat)}
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

            {deletingCategory && (
                <DeleteConfirmation
                    title="Delete Category"
                    message={`Are you sure you want to delete the "${deletingCategory.name}" category? This will fail if there are any tasks currently assigned to it.`}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingCategory(null)}
                />
            )}
        </div>
    );
}

export default Categories;
