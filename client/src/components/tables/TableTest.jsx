import React, { useCallback } from 'react';
import { ContextGlobal } from '../../utils/globalContext';
import { formatDate } from '../../utils/functions';

const MealsTable = React.memo(({ items, loading, onEditBtn, onDeleteBtn }) => {
    console.log('MealsTable rendering with items:', items);

    const renderTableRow = useCallback((item) => (
        <tr key={item._id || item.id}>
            <td className="table-td">{item.itemName}</td>
            <td className="table-td">{formatDate(item.expirationDate)}</td>
            <td className="table-td">{item.category}</td>
            <td className="table-td">{item.quantity}</td>
            <td className="table-td space-x-2">
                <button
                    aria-label={`Edit ${item.itemName}`}
                    onClick={() => onEditBtn(item)}
                    className="table-btn bg-yellow-100 hover:bg-yellow-200 border-yellow-600 
                        text-yellow-600"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Editar'}
                </button>
                <button
                    aria-label={`Delete ${item.itemName}`}
                    onClick={() => onDeleteBtn(item._id)}
                    className="table-btn bg-red-100 hover:bg-red-200 border-red-600 
                        text-red-600"
                    disabled={loading}
                >
                    {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
            </td>
        </tr>
    ), [onEditBtn, onDeleteBtn, loading]);

    return (
        <article className="min-w-full flex flex-col justify-center items-center">
            <table border="1">
                <thead className="bg-blue-100">
                    <tr>
                        <th className="table-th">Producto</th>
                        <th className="table-th">Expira en</th>
                        <th className="table-th">Categoría</th>
                        <th className="table-th">Cantidad</th>
                        <th className="table-th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map(renderTableRow)
                    ) : (
                        <tr>
                            <td colSpan="5" className="table-td text-center">
                                No hay productos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </article>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for memo
    console.log('MealsTable memo comparison:', {
        prevItems: prevProps.items,
        nextItems: nextProps.items,
        itemsEqual: JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items),
        loadingEqual: prevProps.loading === nextProps.loading
    });

    return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items) &&
        prevProps.loading === nextProps.loading &&
        prevProps.onEditBtn === nextProps.onEditBtn &&
        prevProps.onDeleteBtn === nextProps.onDeleteBtn;
});


export default MealsTable;
