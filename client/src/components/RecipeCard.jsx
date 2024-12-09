import React from 'react';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const RecipeCard = ({bgColor}) => {
    return (
        <article>
            <div className="flex flex-col gap-2 p-8 border-2 border-stone-700 text-sm rounded-lg
                relative">
                <h4 className='font-[600]'>Falafel</h4>
                <img src="./img/falafel.jpg" alt="" width={'220px'} />
                <p>
                    Chickpea, herbs and spices. <br />
                    <strong>Calories:</strong> 160 per unit <br/>
                    <strong>Protein:</strong> 18 gr.<br/>
                    <strong>Carbs:</strong> 32 gr.<br/>
                    <strong>Fat:</strong> 22 gr.<br/>
                </p>
                <button className={`shadow-btn ${bgColor} py-2`}>
                    See More
                </button>
            </div>
        </article>
    )
}

export default RecipeCard;
