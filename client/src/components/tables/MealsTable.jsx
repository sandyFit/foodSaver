import React from 'react';
import { formatDate } from '../../utils/functions';
import { useTranslation } from 'react-i18next';

const MealsTable = React.memo(({ items, loading, deletingItemId, onEditBtn, onDeleteBtn }) => {

    const { t } = useTranslation();
    
    if (!Array.isArray(items)) {
        console.error('Items prop must be an array');
        return null;
    }
   
    return (
        <article className="min-w-full flex flex-col justify-center items-center">
            <table border="1">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="table-th">{t('table.product')}</th>
                        <th className="table-th">{t('table.expiresIn')}</th>
                        <th className="table-th">{t('table.category')}</th>
                        <th className="table-th">{t('table.quantity')}</th>
                        <th className="table-th">{t('table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => {
                            const isDeleting = deletingItemId === item._id;

                            return (
                                <tr key={item._id || item.id}>
                                    <td className="table-td">{item.itemName}</td>
                                    <td className="table-td">{formatDate(item.expirationDate)}</td>
                                    <td className="table-td">{item.category}</td>
                                    <td className="table-td">{item.quantity}</td>
                                    <td className="table-td space-x-2">
                                        <button
                                            aria-label={`Edit ${item.itemName}`}
                                            onClick={() => onEditBtn(item)}
                                            className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
                                        // Edit button should remain enabled even if delete is in progress
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            aria-label={`Delete ${item.itemName}`}
                                            onClick={() => onDeleteBtn(item._id)}
                                            className={`table-btn bg-red-100 hover:bg-red-200 border-red-600 
                                                text-red-600 ${isDeleting ? 'opacity-40' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? t('inventory.deletingItem') : t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="table-td text-center">
                                {loading ? t('common.loading') : t('inventory.noItems')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
        </article>
    );
});

export default MealsTable;
