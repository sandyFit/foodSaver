import React from 'react';
import { formatDate } from '../../utils/functions';
import { useTranslation } from 'react-i18next';

const MealsTable = React.memo(({
    items,
    loading,
    deletingItemId,
    onEditBtn,
    onDeleteBtn,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange
}) => {
    const { t } = useTranslation();

    if (!Array.isArray(items)) {
        console.error('Items prop must be an array');
        return null;
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        // Always show first page
        pages.push(1);

        // Calculate start and end of the visible range
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're near the start or end
        if (currentPage <= 3) {
            end = Math.min(4, totalPages - 1);
        }
        if (currentPage >= totalPages - 2) {
            start = Math.max(totalPages - 3, 2);
        }

        // Add ellipsis if needed before middle pages
        if (start > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        // Add ellipsis if needed after middle pages
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <article className="w-full flex flex-col justify-center items-center gap-4">
            <div className="table-container">
                <table className="table-base">
                    <thead>
                        <tr>
                            <th className="table-th min-w-[140px]">{t('table.product')}</th>
                            <th className="table-th min-w-[140px]">{t('table.expiresIn')}</th>
                            <th className="table-th min-w-[120px]">{t('table.location')}</th>
                            <th className="table-th min-w-[220px]">{t('table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => {
                                const isDeleting = deletingItemId === item._id;
                                return (
                                    <tr key={item._id || item.id}>
                                        <td className="table-td">
                                            <div className="line-clamp-2 md:line-clamp-none">
                                                {item.itemName}
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            {formatDate(item.expirationDate)}
                                        </td>
                                        <td className="table-td">
                                            {item.location}
                                        </td>
                                        
                                        <td className="table-td">
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <button
                                                    aria-label={`Edit ${item.itemName}`}
                                                    onClick={() => onEditBtn(item)}
                                                    className="table-btn bg-yellow-100 hover:bg-yellow-200 
                                                        border-yellow-600 text-yellow-600 px-6 lg:px-4 py-1"
                                                >
                                                    {t('common.edit')}
                                                </button>
                                                <button
                                                    aria-label={`Delete ${item.itemName}`}
                                                    onClick={() => onDeleteBtn(item._id)}
                                                    className={`table-btn bg-red-100 hover:bg-red-200 
                                                        border-red-600 text-red-600 px-4 lg:px-4 py-1
                                                        ${isDeleting ? 'opacity-40' : ''}`}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? t('inventory.deletingItem') : t('common.delete')}
                                                </button>
                                            </div>
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
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        {t('table.pagination.first')}
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        {t('table.pagination.previous')}
                    </button>

                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                            disabled={page === '...'}
                            className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-blue-500 text-white' : ''
                                } ${page === '...' ? 'cursor-default' : 'hover:bg-gray-100'}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-xs md:text-sm rounded border disabled:opacity-50"
                    >
                        {t('table.pagination.next')}
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        {t('table.pagination.last')}
                    </button>
                </div>
            )}

            {/* Items per page selector */}
            <div className="mt-2 flex items-center gap-2 text-xs md:text-sm">
                <span className=" ">{t('table.pagination.itemsPerPage')}:</span>
                <select
                    onChange={(e) => onPageChange(1, parseInt(e.target.value))}
                    value={itemsPerPage}
                    className="border rounded p-1"
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </article>
    );
});

export default MealsTable;
