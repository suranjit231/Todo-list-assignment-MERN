import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./errorReducer";
import { setLoading, clearLoading } from "./loaderReducer";

//===== defined initial state ======//
const initialState = {
    authLoading:false,
    isLoggedIn:false,
    user:null,
    authError:null
}


//============== user signup api call ==============//
export const signupApiAsync = createAsyncThunk("auth/signupApi", 
    async(arg, thunkApi)=>{
        try{

            thunkApi.dispatch(setLoading());
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/signup`, arg);
            return response.data;

        }catch(error){
           thunkApi.dispatch(setError(error.response.data));
            return thunkApi.rejectWithValue(error.response.data);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)

//=========== user login api call ==============//
export const loginApiAsync = createAsyncThunk("auth/loginApi",
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/signin`, arg, {withCredentials:true});
            return res.data.signinResult.removedPasswordUser;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data));
            return thunkApi.rejectWithValue(error.response.data);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//======== check user login api call ==============//
export const checkIsLoginAsync = createAsyncThunk("auth/isLoginAsync", 
    async(arg, thunkAPI)=>{
      try{
  
          thunkAPI.dispatch(setLoading());
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/isLogin`, 
            {withCredentials:true});

       return response.data.user;
      
      }catch(error){
        thunkAPI.dispatch(setError("server error"));
        return thunkAPI.rejectWithValue("Server error");
  
      }finally{
        thunkAPI.dispatch(clearLoading());
      }
    }
  )

  //======= logout api async =============//
  export const logoutApiAsync = createAsyncThunk("auth/logoutApi", 
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/logout`,
                {withCredentials:true});

            return res.data;

        }catch(error){
            thunkAPI.dispatch(setError("server error"));
            return thunkAPI.rejectWithValue("Server error");

        }finally{
            thunkAPI.dispatch(clearLoading());
          }
    }
  )



//============ create silce for managing the auth state =============//
const authSlice = createSlice({
    name:"auth",
    initialState:initialState,

    reducers:{},

    //===== defined extra reducer for update auth state for any async api calls related to auth =====//
    extraReducers:(builders)=>{
         builders
        // ======= update state when login successfull =======//
        .addCase(loginApiAsync.fulfilled, (state, action)=>{
            state.isLoggedIn = true;
           // console.log("action.payload: ", action.payload)
            state.user = {...action.payload}
        })

        .addCase(checkIsLoginAsync.fulfilled, (state, action)=>{
            state.isLoggedIn = true;
            state.user = {...action.payload}

        })

        .addCase(logoutApiAsync.fulfilled, (state, action)=>{
            if(action.payload?.success){
                state.isLoggedIn = false;
                state.user = null;
            }
        })

    }
});


export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const authSelector = (state)=>state.authReducer;