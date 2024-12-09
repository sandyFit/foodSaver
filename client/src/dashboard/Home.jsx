import React from 'react';
// import Dashboard from './Dashboard';
import MealsTable from '../components/MealsTable';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    return (

        <section className='w-[86vw] mt-5'>
            <div className="flex justify-center gap-28">
                <div className="">
                    <h4 className='mb-4'>Meals Close to Expire</h4>
                    <MealsTable />
                </div>
                <div className="flex flex-col b gap-4">
                    <h4>Suggested Recipes</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <RecipeCard bgColor='bg-yellow-100'/>
                        <RecipeCard bgColor='bg-blue-100'/>                       
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Home
