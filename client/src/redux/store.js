import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { errorReducer } from "./errorReducer";
import { loadingReducer } from "./loaderReducer";
import { todoReducer } from "./todoReducer";

//====== create a global store for storing all the state data ==========//
const store = configureStore({
    reducer:{
        authReducer,
        errorReducer,
        loadingReducer,
        todoReducer,

    }
});


export default store;