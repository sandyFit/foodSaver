import React from 'react';
import MealsTable from '../components/MealsTable';


const MealsList = () => {
     
    return (
        <section className="w-full grid grid-cols-12">
            <div className="col-span-12 justify-center items-center ">
                {/* Header */}
                <header className="col-span-12 flex justify-between items-center border-b-2 border-stone-900 ">
                    <h4 className="text-lg font-bold">Lista de Productos</h4>
                    <button className="shadow-btn px-12 py-2 mb-12  bg-purple-100 rounded-md">
                        Agregar Producto
                    </button>
                </header>
                {/* Table */}
                <div className="col-span-12 flex justify-center mt-12">
                    <div className="col-span-12 max-w-5xl">
                        <div
                            className="rounded-md"
                        >
                            <MealsTable />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MealsList;
