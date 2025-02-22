import React, { useCallback, useMemo } from 'react';
import { formatDate } from '../../utils/functions';

const TableCell = React.memo(({ children }) => (
    <td className="table-td">{children}</td>
));

const ActionButtons = React.memo(({ item, loading, onEditBtn, onDeleteBtn }) => (
    <td className="table-td space-x-2">
        <button
            aria-label={`Edit ${item.itemName}`}
            onClick={() => onEditBtn(item)}
            className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-600"
            disabled={loading}
        >
            {loading ? 'Cargando...' : 'Editar'}
        </button>
        <button
            aria-label={`Delete ${item.itemName}`}
            onClick={() => onDeleteBtn(item._id)}
            className="table-btn bg-red-100 hover:bg-red-200 border-red-600 text-red-600"
            disabled={loading}
        >
            {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
    </td>
));

const TableRow = React.memo(({ item, loading, onEditBtn, onDeleteBtn }) => (
    <tr key={item._id || item.id}>
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
));

const TableHeader = React.memo(() => (
    <thead className="bg-blue-100">
        <tr>
            <th className="table-th">Producto</th>
            <th className="table-th">Expira en</th>
            <th className="table-th">Categoría</th>
            <th className="table-th">Cantidad</th>
            <th className="table-th">Acciones</th>
        </tr>
    </thead>
));

const MealsTable = ({ items, loading, onEditBtn, onDeleteBtn }) => {
    const memoizedItems = useMemo(() => items, [items]);

    const renderTableRows = useCallback(() => (
        memoizedItems.length > 0 ? (
            memoizedItems.map(item => (
                <TableRow
                    key={item._id || item.id}
                    item={item}
                    loading={loading}
                    onEditBtn={onEditBtn}
                    onDeleteBtn={onDeleteBtn}
                />
            ))
        ) : (
            <tr>
                <td colSpan="5" className="table-td text-center">
                    No hay productos disponibles
                </td>
            </tr>
        )
    ), [memoizedItems, loading, onEditBtn, onDeleteBtn]);

    return (
        <article className="min-w-full flex flex-col justify-center items-center">
            <table border="1">
                <TableHeader />
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </article>
    );
};

export default React.memo(MealsTable, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items) &&
        prevProps.loading === nextProps.loading &&
        prevProps.onEditBtn === nextProps.onEditBtn &&
        prevProps.onDeleteBtn === nextProps.onDeleteBtn;
});
