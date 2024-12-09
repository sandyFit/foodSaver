import React from 'react'

const MealsTable = () => {
    return (
        <article>
            <table border="1">
                <thead className='bg-tahiti-200'>
                    <tr >
                        <th className='table-th'>Meal Name</th>
                        <th className='table-th'>Expiration Date</th>
                        <th className='table-th'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='table-td'>Pasta Salad</td>
                        <td className='table-td'>2024-12-01</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Chicken Wrap</td>
                        <td className='table-td'>2024-12-02</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Pasta Salad</td>
                        <td className='table-td'>2024-12-01</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Chicken Wrap</td>
                        <td className='table-td'>2024-12-02</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Pasta Salad</td>
                        <td className='table-td'>2024-12-01</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Chicken Wrap</td>
                        <td className='table-td'>2024-12-02</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Pasta Salad</td>
                        <td className='table-td'>2024-12-01</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='table-td'>Chicken Wrap</td>
                        <td className='table-td'>2024-12-02</td>
                        <td className='table-td space-x-2'>
                            <button className='table-btn bg-blue-100 hover:bg-blue-200'>Use</button>
                            <button className='table-btn bg-yellow-50 hover:bg-yellow-100'>Donate</button>
                            <button className='table-btn bg-red-200 hover:bg-red-300'>Discard</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </article>

    )
}

export default MealsTable;

