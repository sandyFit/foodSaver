import React from 'react';
import { MdOutlineKitchen, MdShelves } from "react-icons/md";
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const MealCard = ({ itemName, expirationDate, category, bgColor }) => {
    // Define las categorías y sus íconos
    const categoryIcons = [
        { icon: <MdOutlineKitchen />, catName: "Refrigerados" },
        { icon: <MdOutlineKitchen />, catName: "Congelados" },
        { icon: <MdShelves />, catName: "Alacena" },
        { icon: <MdShelves />, catName: "Frescos" }
    ];

    // Encuentra el ícono correspondiente a la categoría
    const selectedCategory = categoryIcons.find(cat => cat.catName === category);

    // Calcula el tiempo restante o si ya expiró
    const expirationStatus = () => {
        try {
            const expDate = parseISO(expirationDate);
            if (isPast(expDate)) {
                return "Expirado";
            }
            return `Expira en ${formatDistanceToNow(expDate, { locale: es })}`;
        } catch (error) {
            console.error("Error parsing expirationDate:", error);
            return "Fecha inválida";
        }
    };

    return (
        <article className={`w-full max-w-lg py-2 px-4 border-2 border-stone-900 rounded-lg ${bgColor} bg-opacity-60`}>
            <div className="w-full flex justify-between items-center py-1">
                <div className="flex flex-col min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate ">
                        {itemName}
                    </p>
                    {/* Aquí se hace la llamada correcta a la función expirationStatus */}
                    <p className="text-sm text-gray-500 truncate ">
                        {expirationStatus()}  {/* Se llama a la función aquí */}
                    </p>
                </div>
                <div className="flex flex-col items-center min-w-0 ms-4">
                    {/* Muestra el ícono correspondiente o un ícono por defecto */}
                    {selectedCategory ? selectedCategory.icon : <MdOutlineKitchen />}
                    <p className="text-sm text-gray-500 truncate ">
                        {category}
                    </p>
                </div>
            </div>
        </article>
    );
};


export default MealCard;
