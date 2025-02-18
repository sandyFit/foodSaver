import React, { memo } from 'react';
import MealsTable from '../tables/MealsTable';

const TableContainer = memo(({ items, loading, onDeleteBtn, onEditBtn }) => {
    return (
        <div className="w-full col-span-12 flex flex-col items-center mt-6">
            <h4 className="text-lg font-bold mb-2">Tu Lista de Productos</h4>
            <MealsTable
                items={items}
                loading={loading}
                onDeleteBtn={onDeleteBtn}
                onEditBtn={onEditBtn}
            />
        </div>
    );
});

export default TableContainer;
