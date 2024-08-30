import Navbar from "./components/navbar/Navbar";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/home/Home";
import SignupForm from "./pages/auth/SignupForm";
import LoginForm from "./pages/auth/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTaskPage from "./pages/userTask/UserTask";
import ProtectedRoute from "./utils/ProtectedRoute";
import TodoForm from "./pages/todoForm/TodoForm";
import Tasks from "./pages/userTask/Tasks";
import { checkIsLoginAsync } from "./redux/authReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingSelector } from "./redux/loaderReducer";
import { ClipLoader } from "react-spinners";
import { UserTaskProvider } from "./utils/UserTaskContext";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector(loadingSelector);

  useEffect(()=>{
    dispatch(checkIsLoginAsync());

  },[dispatch])



  const router = createBrowserRouter([
        {path:"/", element:<Navbar />,

          children:[
            {index:true, element:<HomePage />},
            {path:"users/signup", element:<SignupForm />},
            {path:"users/signin", element:<LoginForm />}
          ]
        },

        {path:"/users/:userId/tasks", element:<ProtectedRoute>
            <UserTaskPage />
          </ProtectedRoute>,
          children:[
            {index:true, element:<Tasks />},

            {path:"add-task", element:<ProtectedRoute><TodoForm /></ProtectedRoute>},
            {path:"edit-task/:todoId", element:<ProtectedRoute><TodoForm /></ProtectedRoute>}
          ]
          
        }
  ])


  return (
    <div className="App">
         <UserTaskProvider>
                <RouterProvider router={router} />
            </UserTaskProvider>
          <ToastContainer className="custom-toast-container" />
    </div>
  );
}

export default App;
