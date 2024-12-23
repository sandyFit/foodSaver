import React from 'react'

const Spinner = () => (
    <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="sr-only">Cargando...</span>
        </div>
    </div>
);


export default Spinner
