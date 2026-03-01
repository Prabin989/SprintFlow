import React from 'react';

function DeleteConfirmation({ title, message, onConfirm, onCancel, isDeleting, error }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                    <h2 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Confirm Deletion
                    </h2>
                    <button className="close-btn" onClick={onCancel} disabled={isDeleting}>&times;</button>
                </div>

                <div className="form-layout" style={{ paddingTop: '16px' }}>
                    {error && <div className="error-banner" style={{ marginBottom: '0' }}>{error}</div>}
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title}</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>{message}</p>

                    <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '16px', marginTop: '8px' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmation;
