import React from 'react';
import { MdOutlineKitchen, MdShelves } from "react-icons/md";
import { formatDistanceToNow, isPast, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const MealCard = ({ itemName, expirationDate, category, bgColor }) => {
    const { t, i18n } = useTranslation();

    // For categories, we can still translate these as they're likely predefined
    const categoryIcons = [
        { icon: <MdOutlineKitchen />, catName: t("categories.refrigerated", "Refrigerados") },
        { icon: <MdOutlineKitchen />, catName: t("categories.frozen", "Congelados") },
        { icon: <MdShelves />, catName: t("categories.pantry", "Alacena") },
        { icon: <MdShelves />, catName: t("categories.fresh", "Frescos") }
    ];

    // Find the icon corresponding to the category
    // Use translated category names for matching
    const translatedCategory = t(`categories.${category}`, category);
    const selectedCategory = categoryIcons.find(cat => cat.catName === translatedCategory);

    // For expirationStatus, use the current language
    const expirationStatus = () => {
        if (!expirationDate || expirationDate === "") {
            return t("expiring-products.noValidDate");
        }

        let expDate;
        try {
            expDate = typeof expirationDate === 'string' ? parseISO(expirationDate) : new Date(expirationDate);

            if (!isValid(expDate) || expDate.toString() === 'Invalid Date') {
                return t("expiring-products.noValidDate");
            }

            const currentLanguage = i18n.language || 'en';
            const locale = currentLanguage.startsWith('es') ? es : enUS;

            if (isPast(expDate)) {
                return t("expiring-products.expired");
            }

            return `${t("expiring-products.daysLeft")} ${formatDistanceToNow(expDate, { locale })}`;
        } catch (error) {
            console.error("Error processing date:", error, "Value:", expirationDate);
            return t("expiring-products.noValidDate");
        }
    };

    return (
        <article className={`w-full max-w-lg py-2 px-4 md:px-6 border-2 border-stone-900 rounded-lg 
            ${bgColor} bg-opacity-60`}>
            <div className="w-full flex justify-between items-center py-1">
                <div className="flex flex-col min-w-0 ">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {itemName} 
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                        {expirationStatus()}
                    </p>
                </div>
                <div className="flex flex-col items-center min-w-0 ">
                    {selectedCategory ? selectedCategory.icon : <MdOutlineKitchen />}
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                        {translatedCategory}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default MealCard;
