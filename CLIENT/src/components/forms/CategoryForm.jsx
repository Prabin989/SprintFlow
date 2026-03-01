import { useState, useEffect } from 'react';

function CategoryForm({ category, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setColor(category.color);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const url = 'http://localhost:3000/api/categories' + (category ? `/${category.id}` : '');
        const method = category ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, color }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save category');
            }

            onSave(); // Trigger parent refresh
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{category ? 'Edit Category' : 'New Category'}</h2>
                    <button className="close-btn" onClick={onCancel}>&times;</button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="form-layout">
                    <div className="form-group">
                        <label htmlFor="name">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Marketing"
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <div className="color-picker-wrapper">
                            <input
                                type="color"
                                id="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <span className="color-hex">{color}</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryForm;
