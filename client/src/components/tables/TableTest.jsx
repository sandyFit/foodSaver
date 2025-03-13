import React, { useCallback, useMemo } from 'react';
import { formatDate } from '../../utils/functions';
import { useTranslation } from 'react-i18next';

// Render counter for tracking renders
let renderCounts = {
    TableCell: 0,
    ActionButtons: 0,
    TableRow: 0,
    TableHeader: 0,
    MealsTable: 0
};

// Pure component for table cells
const TableCell = React.memo(({ children }) => {
    renderCounts.TableCell++;
    return (
        <td className="table-td">{children}</td>
    );
});

TableCell.displayName = 'TableCell';

// Memoized action buttons
const ActionButtons = React.memo(({ item, loading, onEditBtn, onDeleteBtn }) => {
    renderCounts.ActionButtons++;
    const { t } = useTranslation();

    // Memoize handlers to prevent recreation on render
    const handleEdit = useCallback(() => onEditBtn(item), [onEditBtn, item]);
    const handleDelete = useCallback(() => onDeleteBtn(item._id), [onDeleteBtn, item._id]);

    return (
        <td className="table-td space-x-2">
            <button
                aria-label={`Edit ${item.itemName}`}
                onClick={handleEdit}
                className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
                disabled={loading}
            >
                {loading ? t('common.loading') : t('common.edit')}
            </button>
            <button
                aria-label={`Delete ${item.itemName}`}
                onClick={handleDelete}
                className="table-btn bg-red-100 hover:bg-red-200 border-red-600 text-red-600"
                disabled={loading}
            >
                {loading ? t('inventory.deletingItem') : t('common.delete')}
            </button>
        </td>
    );
});

ActionButtons.displayName = 'ActionButtons';

// Memoized table row with proper props comparison
const TableRow = React.memo(({ item, loading, onEditBtn, onDeleteBtn }) => {
    renderCounts.TableRow++;
    return (
        <tr>
            <TableCell>{item.itemName}</TableCell>
            <TableCell>{formatDate(item.expirationDate)}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <ActionButtons
                item={item}
                loading={loading}
                onEditBtn={onEditBtn}
                onDeleteBtn={onDeleteBtn}
            />
        </tr>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for deep equality
    return (
        prevProps.loading === nextProps.loading &&
        prevProps.item._id === nextProps.item._id &&
        prevProps.item.itemName === nextProps.item.itemName &&
        prevProps.item.expirationDate === nextProps.item.expirationDate &&
        prevProps.item.category === nextProps.item.category &&
        prevProps.item.quantity === nextProps.item.quantity &&
        prevProps.onEditBtn === nextProps.onEditBtn &&
        prevProps.onDeleteBtn === nextProps.onDeleteBtn
    );
});

TableRow.displayName = 'TableRow';

// Static header component - only renders once
const TableHeader = React.memo(() => {
    renderCounts.TableHeader++;
    const { t } = useTranslation();

    return (
        <thead className="bg-blue-100">
            <tr>
                <th className="table-th">{t('table.product')}</th>
                <th className="table-th">{t('table.expiresIn')}</th>
                <th className="table-th">{t('table.category')}</th>
                <th className="table-th">{t('table.quantity')}</th>
                <th className="table-th">{t('table.actions')}</th>
            </tr>
        </thead>
    );
});

TableHeader.displayName = 'TableHeader';

// Main table component with optimized rendering
const MealsTable = ({ items, loading, onEditBtn, onDeleteBtn }) => {
    renderCounts.MealsTable++;
    const { t } = useTranslation();

    // Deep memoize the items array to prevent unnecessary re-renders
    const memoizedItems = useMemo(() => items, [items]);

    // Log render count every 10 renders
    if (renderCounts.MealsTable % 10 === 0) {
        console.log('🔄 Table render counts:', renderCounts);
    }

    // Render each row with a memoized callback
    const renderTableRows = useCallback(() => {
        if (memoizedItems.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="table-td text-center">
                        {t('inventory.noItems')}
                    </td>
                </tr>
            );
        }

        return memoizedItems.map(item => (
            <TableRow
                key={item._id || item.id}
                item={item}
                loading={loading}
                onEditBtn={onEditBtn}
                onDeleteBtn={onDeleteBtn}
            />
        ));
    }, [memoizedItems, loading, onEditBtn, onDeleteBtn, t]);

    // Memoize the entire tbody to prevent unnecessary recreations
    const memoizedTableBody = useMemo(() => renderTableRows(), [renderTableRows]);

    return (
        <article className="min-w-full flex flex-col justify-center items-center">
            <table border="1">
                <TableHeader />
                <tbody>
                    {memoizedTableBody}
                </tbody>
            </table>
        </article>
    );
};

// Custom equality check for the entire table
export default React.memo(MealsTable, (prevProps, nextProps) => {
    // Shallow comparison for props
    if (prevProps.loading !== nextProps.loading) return false;
    if (prevProps.onEditBtn !== nextProps.onEditBtn) return false;
    if (prevProps.onDeleteBtn !== nextProps.onDeleteBtn) return false;

    // Deep comparison for items array
    if (prevProps.items.length !== nextProps.items.length) return false;

    // Item-by-item comparison using JSON.stringify
    const prevItemsStr = JSON.stringify(prevProps.items);
    const nextItemsStr = JSON.stringify(nextProps.items);
    return prevItemsStr === nextItemsStr;
});
