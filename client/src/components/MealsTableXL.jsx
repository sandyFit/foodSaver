import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MealsTableXL = () => {

    const [mealList, setMealList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        


    })


    return (
        <article className='w-full'>
            <table border="1">
                <thead className='bg-tahiti-200'>
                    <tr >
                        <th className='table-th-xl'>Producto</th>
                        <th className='table-th-xl'>Fecha de Exp</th>
                        <th className='table-th-xl'>Cantidad</th>
                        <th className='table-th-xl'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='table-td-xl'>Pasta Salad</td>
                        <td className='table-td-xl'>2024-12-01</td>
                        <td className='table-td-xl'>1</td>
                        <td className='table-td-xl space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Edit</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Remove</button>
                            
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </article>

    )
}

export default MealsTableXL;
