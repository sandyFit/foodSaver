import React from 'react';

const LoaderComponent = () => {

    return (
        loading && (
            <div className="flex justify-center items-center h-screen w-screen fixed top-0 left-0 
                bg-black bg-opacity-50 z-50">
                <div className="loader" role="status">
                    
                </div>
            </div>
        )
    );
}

export default LoaderComponent; 
