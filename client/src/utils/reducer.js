export const ADD_INVENTORY_ITEM = 'ADD_INVENTORY_ITEM';
export const SET_ALL_INVENTORY_ITEMS = 'SET_ALL_INVENTORY_ITEMS';
export const SET_INVENTORY_ITEM = 'SET_INVENTORY_ITEM';
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
        case ADD_INVENTORY_ITEM:
            return { ...state, allInventoryItems: [...state.allInventoryItems, action.payload] };
        case SET_ALL_INVENTORY_ITEMS:
            console.log('Reducer payload:', action.payload);
            return {
                ...state,
                allInventoryItems: JSON.stringify(state.allInventoryItems) === JSON.stringify(action.payload)
                    ? state.allInventoryItems
                    : action.payload,
                loading: false,
            };

        case SET_INVENTORY_ITEM:
            return { ...state, inventoryItem: action.payload };
        case SET_EXPIRING_MEALS:

            return { ...state, expiringMeals: action.payload }; 
        case REGISTER_USER:
            return {
                ...state,
                allUsers: state.allUsers ? [...state.allUsers, action.payload] : [action.payload]
            };
        case SET_ALL_USERS:
            return { ...state, allUsers: action.payload };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
            
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
