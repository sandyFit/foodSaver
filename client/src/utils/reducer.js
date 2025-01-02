export const ADD_FOODITEM = 'ADD_FOODITEM';
export const SET_ALL_FOODITEMS = 'SET_ALL_FOODITEMS';
export const SET_FOODITEM = 'SET_FOODITEM';
export const REGISTER_USER = 'REGISTER_USER';
export const SET_ALL_USERS = 'SET_ALL_USERS';
export const SET_USER = 'SET_USER';
export const SET_ALL_RECIPES = 'SET_ALL_RECIPES';
export const SET_RECIPE = 'SET_RECIPE';
export const SET_SUGGESTED_RECIPES = 'SET_SUGGESTED_RECIPES';
export const SET_EXPIRING_MEALS = 'SET_EXPIRING_MEALS';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';


export const reducer = (state, action) => {
    switch (action.type) {
        case ADD_FOODITEM:
            return { ...state, allFoodItems: [...state.allFoodItems, action.payload] };
        case SET_ALL_FOODITEMS:
            return { ...state, allFoodItems: action.payload };
        case SET_FOODITEM:
            return { ...state, foodItem: action.payload };
        case SET_EXPIRING_MEALS:

            return { ...state, expiringMeals: action.payload }; 
        case REGISTER_USER:
            return { ...state, allUsers: [...state.allUsers, action.payload] };
        case SET_ALL_USERS:
            return { ...state, allUsers: action.payload };
        case SET_USER:
            console.log("SET_USER action payload:", action.payload); 
            return { ...state, user: action.payload };
            
        case SET_ALL_RECIPES:
            return { ...state, allRecipes: action.payload };
        case SET_RECIPE:
            return { ...state, recipe: action.payload };
        case SET_SUGGESTED_RECIPES:
            return { ...state, suggestedRecipes: action.payload };
        case SET_ERROR:
            return { ...state, error: action.payload }
        case SET_LOADING:
            return { ...state, loading: action.payload };
        default:
            console.warn(`Unhandled action type: ${action.type}`);
            return state;
    }
};
