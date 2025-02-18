import React from 'react';
import { formatDate } from '../../utils/functions';

const TableTest = React.memo(({ items }) => {
    console.log('TableTest render:', items);

    if (!Array.isArray(items)) {
        console.error('Items prop must be an array');
        return null;
    }
    return (
        
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Expira en</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {items.length > 0 ? (
                    items.map((item) => (
                        <tr key={item._id}>
                            <td>{item.itemName}</td>
                            <td>{formatDate(item.expirationDate)}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No hay productos disponibles</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
    
});

export default TableTest;

