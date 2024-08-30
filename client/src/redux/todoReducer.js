import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./errorReducer";
import { setLoading, clearLoading } from "./loaderReducer";

const initialState = {
    todoLoading:false,
    todos:[],
    todosError:null
}

//=======  add a new todo =============//
export const addTodoApiAsync = createAsyncThunk("todo/addTodoApi", 
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/tasks/createTask`,
                 arg, {withCredentials:true});

            return res.data.task;

        }catch(error){
         
            thunkApi.dispatch(setError(error.response.data.msg));
            return thunkApi.rejectWithValue(error.response.data.msg);
        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)

//======== get all todos ====================//
export const getAllTodoApiAsync = createAsyncThunk("todo/getAllTodoApi", 
    async(arg, thunkApi)=>{
        try{
            thunkApi.dispatch(setLoading());
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/viewAllTask`, 
                {withCredentials:true}
            )
            return res.data.tasks;

        }catch(error){
           // console.log("error for get all todo: ", error);
            thunkApi.dispatch(setError(error.response.data));
            return thunkApi.rejectWithValue(error.response.data);
        }
        finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)

//========  delete todo async api call =================//
export const deleteTodoApiAsync = createAsyncThunk("todo/deleteTodoApi", 
    async(arg, thunkApi)=>{
        try{

            const {taskId} = arg;
            const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/tasks/deleteTask/${taskId}`,
                {withCredentials:true}
            );

            return taskId;

        }catch(error){
            thunkApi.dispatch(setError(error.response.data));
            return thunkApi.rejectWithValue(error.response.data);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//========== update todo api async call ============//
export const updateTodoApiAsync = createAsyncThunk("todo/updateTodoApi", 
    async(arg, thunkApi)=>{
        try{

            thunkApi.dispatch(setLoading());
            const { todoId, title, desc, dueDate } = arg;
            const res= await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/tasks/updateTask/${todoId}`, 
                {title, desc, dueDate}, {withCredentials:true}
            )

            return res.data.task;

        }catch(error){

          //  console.log("error for edit task api: ", error);
            thunkApi.dispatch(setError(error.response.data.msg));
            return thunkApi.rejectWithValue(error.response.data.msg);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
);


  //======= get all pending task ==========//
  export const getCompletedTaskApiAsync = createAsyncThunk("task/getCompletedTaskApi",
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());

            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/completedTask`, 
                {withCredentials:true});

       

            if(res.data?.tasks.length<1){
                thunkAPI.dispatch(setError("No completed task found!"))
            }

            return res.data.tasks;


        }catch(error){

            thunkAPI.dispatch(setError("server error"));
            return thunkAPI.rejectWithValue("Server error");

        }finally{
            thunkAPI.dispatch(clearLoading());
        }
    }
  )


//======= get all pending task ===================//
export const getPendingTaskApiAsync = createAsyncThunk("todo/getPendingTaskApi",
    async(arg, thunkAPI)=>{
        try{
            thunkAPI.dispatch(setLoading());
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/pendingTask`, 
                {withCredentials:true});


            if(res.data?.tasks.length<1){
                thunkAPI.dispatch(setError("No pending task found!"))
            }

            return res.data.tasks;


        }catch(error){
            thunkAPI.dispatch(setError("server error"));
            return thunkAPI.rejectWithValue("Server error");

        }finally{
            thunkAPI.dispatch(clearLoading());
        }

    }
)


//======== mark todo as complete api call =================//
export const markTodoCompleteApiAsync  = createAsyncThunk("todo/markTodoApi", 
    async(arg, thunkApi)=>{
        try{

            const {todoId} = arg;
            thunkApi.dispatch(setLoading());
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/tasks/markTask/${todoId}`,{},
                {withCredentials:true});

            return res.data.task;

        }catch(error){
            console.log("error todo markConmplete: ", error);
            thunkApi.dispatch(setError(error.response.data.msg));
            return thunkApi.rejectWithValue(error.response.data.msg);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)


//======= search todo api async ==================//
export const searchTodoApiAsync = createAsyncThunk("todo/searchTodoApiAsync",
    async(arg, thunkApi)=>{
        try{

            const {searchText} = arg;
            thunkApi.dispatch(setLoading());
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/search`, {
                params: { q: searchText }, 
                withCredentials: true});

           // console.log("res.data for search todo: ", res.data);

            if(res.data?.tasks.length<1){
                thunkApi.dispatch(setError("No todo is found."));

            }

            return res.data.tasks;

        }catch(error){
            console.log("error todo markConmplete: ", error);
            thunkApi.dispatch(setError(error.response.data.msg));
            return thunkApi.rejectWithValue(error.response.data.msg);

        }finally{
            thunkApi.dispatch(clearLoading());
        }
    }
)



//======== create todo slice for manage states of todos and creating reducer =========//
const todoSlice = createSlice({
    name:"todo",
    initialState:initialState,
    reducers:{},

    extraReducers:(builders)=>{
        builders
            //======= update states on the basis of addTodoApi async ========//
            .addCase(addTodoApiAsync.fulfilled, (state, action)=>{
                state.todos.push({...action.payload});
            })

            //======= update state for initial todos ==========//
            .addCase(getAllTodoApiAsync.fulfilled, (state, action)=>{
               // console.log("action.payload in get all todo extra: ", action.payload);
                state.todos = [...action.payload];
            })

            //====== update state for delete task ==============//
            .addCase(deleteTodoApiAsync.fulfilled, (state, action)=>{
                state.todos = state.todos.filter((todo)=>todo._id !== action.payload);
            })

            .addCase(updateTodoApiAsync.fulfilled, (state, action)=>{
                //console.log("action.payload extra edit: ", action.payload);
                state.todos = state.todos.map((todo)=>{
                    if(todo._id===action.payload._id){
                        todo = {...action.payload}
                    }

                    return todo;
                });
            })

            //======= update state for mark todo complete =========//
            .addCase(markTodoCompleteApiAsync.fulfilled, (state, action)=>{
                state.todos = state.todos.map((todo)=>{
                    if(todo._id===action.payload._id){
                        todo={...action.payload}
                    }

                    return todo;
                })
            })

            //======= get all completed tasks ======//
            .addCase(getCompletedTaskApiAsync.fulfilled, (state, action)=>{
                state.todos = [...action.payload];
            })

            //====== get all pending tasks ===========//
            .addCase(getPendingTaskApiAsync.fulfilled, (state, action)=>{
                state.todos = [...action.payload];
            })

            //====== update state for search text =====//
            .addCase(searchTodoApiAsync.fulfilled, (state, action)=>{
                state.todos = [...action.payload];
            })
    }
});




export const todoReducer = todoSlice.reducer;
export const todoActions = todoSlice.actions;
export const todoSelector = (state)=>state.todoReducer;