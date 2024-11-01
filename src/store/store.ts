import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    user: {
        name: 'John Doe'
    }
}

interface SetUserNameAction {
    type: 'SET_USER_NAME';
    payload: string;
}

type UserAction = SetUserNameAction;

const reducer = (state = initialState, action: UserAction) => {
    switch (action.type) {
        case 'SET_USER_NAME':
            return {
                ...state,
                user: {
                    ...state.user,
                    name: action.payload
                }
            }
        default:
            return state;
    }
}


const store = configureStore({
  reducer: {
    // Add reducers here
    user: reducer
  },
});

export default store;
