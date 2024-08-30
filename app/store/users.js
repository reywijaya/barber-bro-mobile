const INITIAL_STATE = {
    loggedInUser: {},
    message: "Hello Gosling 3",
};

export const user = (state = INITIAL_STATE, action) => {
    if (action.type === "LOGIN") {
        return {...state, loggedInUser: action.payload};
    } else if (action.type === "LOGOUT") {
        return {...state, loggedInUser: {}};
    }else if (action.type === "EDIT") {
        return {...state, loggedInUser: action.payload};
    }
    return state;
};