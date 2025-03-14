import React, { useState } from 'react';
import AddItemModal from '../modals/AddItemModal';

const AddItemForm = React.memo(() => {
    // State to track whether the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <article className='w-full border-b-2 border-zinc-950 flex justify-end pb-8'>
            <button className='shadow-btn px-4 py-2 bg-purple-200 rounded mr-2 flex items-center'
                onClick={openModal}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                    />
                </svg>
                Agrega tus productos
            </button>

            {/* Render the modal when isModalOpen is true */}
            {isModalOpen && <AddItemModal onClose={closeModal} />}
        </article>
    );
});

// Add display name for better debugging
AddItemForm.displayName = 'AddItemForm';

export default AddItemForm;
