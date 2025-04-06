import React from 'react';
import { MdOutlineKitchen, MdShelves } from "react-icons/md";
import { formatDistanceToNow, isPast, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const MealCard = ({ itemName, expirationDate, category, bgColor }) => {
    // Define las categorías y sus íconos
    const categoryIcons = [
        { icon: <MdOutlineKitchen />, catName: "Refrigerados" },
        { icon: <MdOutlineKitchen />, catName: "Congelados" },
        { icon: <MdShelves />, catName: "Alacena" },
        { icon: <MdShelves />, catName: "Frescos" }
    ];

    const { t, i18n } = useTranslation();
    // Encuentra el ícono correspondiente a la categoría
    const selectedCategory = categoryIcons.find(cat => cat.catName === category);

    // Translate the item name if it's a translation key
    const translatedItemName = itemName ? t(itemName, itemName) : "";

    // Translate the category if needed
    const translatedCategory = category ? t(category, category) : "";

    // Calcula el tiempo restante o si ya expiró
    const expirationStatus = () => {
        // First, check if we have a date to work with
        if (!expirationDate || expirationDate === "") {
            return t("expiring-products.noValidDate");
        }

        let expDate;
        try {
            // Try to parse the date
            expDate = typeof expirationDate === 'string' ? parseISO(expirationDate) : new Date(expirationDate);

            // Check if the parsed date is valid
            if (!isValid(expDate) || expDate.toString() === 'Invalid Date') {
                return t("expiring-products.noValidDate");
            }

            // Determine which locale to use
            const currentLanguage = i18n.language || 'en';
            const locale = currentLanguage.startsWith('es') ? es : enUS;

            // Check if the date is in the past
            if (isPast(expDate)) {
                return t("expiring-products.expired");
            }

            // Return the formatted time distance
            return `${t("expiring-products.daysLeft")} ${formatDistanceToNow(expDate, { locale })}`;
        } catch (error) {
            console.error("Error processing date:", error, "Value:", expirationDate);
            return t("expiring-products.noValidDate");
        }
    };

    return (
        <article className={`w-full max-w-lg py-2 px-4 border-2 border-stone-900 rounded-lg ${bgColor} 
            bg-opacity-60`}>
            <div className="w-full flex justify-between items-center py-1">
                <div className="flex flex-col min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {translatedItemName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {expirationStatus()}
                    </p>
                </div>
                <div className="flex flex-col items-center min-w-0 ms-4">
                    {selectedCategory ? selectedCategory.icon : <MdOutlineKitchen />}
                    <p className="text-sm text-gray-500 truncate">
                        {translatedCategory}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default MealCard;
