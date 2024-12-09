import React from 'react';
import MealsTableXL from '../components/MealsTableXL';

const MealsList = () => {

     
    return (
        <section className="w-full flex justify-center items-start mt-5">
            <div className="w-[86vw] flex flex-col justify-center items-center gap-8 px-8">
                {/* Header */}
                <header className="w-full flex justify-between items-center">
                    <h4 className="mb-4 text-lg font-bold">Lista de Productos</h4>
                    <button className="shadow-btn px-12 py-2 bg-yellow-100 rounded-md">
                        Agregar Producto
                    </button>
                </header>
                {/* Table */}
                <div className="w-full flex justify-center mt-6">
                    <div className="w-full max-w-2xl">
                        <MealsTableXL />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MealsList;
