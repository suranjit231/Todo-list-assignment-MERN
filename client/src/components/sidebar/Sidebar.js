import styles from "./Sidebar.module.css";
import { Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/authReducer";
import { toast } from "react-toastify";
import { AiFillProduct } from "react-icons/ai";
import { loadingSelector } from "../../redux/loaderReducer";
import { LuListTodo } from "react-icons/lu";
import { AiOutlineFileDone } from "react-icons/ai";
import { MdPendingActions } from "react-icons/md";
import { ImHistory } from "react-icons/im";
import { TiHeartFullOutline } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { getCompletedTaskApiAsync, getPendingTaskApiAsync, 
     getAllTodoApiAsync, } from "../../redux/todoReducer";
import { logoutApiAsync } from "../../redux/authReducer";
import { useLocation, useParams } from "react-router-dom";
import { useUserTask } from "../../utils/UserTaskContext";


export default function UserSidebar() {
   
    const {isLoggedIn, user} = useSelector(authSelector);
    const {loading } = useSelector(loadingSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId, taskId} = useParams();
    const location  = useLocation().pathname;

    //====== consume userTask context =====//
    const { isShowSidebar, toggleShowSidebar} = useUserTask();

    //===== handle click get completed task =======//
    function handleClickGetCompletedtask(){
        dispatch(getCompletedTaskApiAsync());
        toggleShowSidebar();
    }

    //====== handle click get all pending task =====//
    function handleClickGetAllPendingTask(){
        dispatch(getPendingTaskApiAsync());
        toggleShowSidebar();
    }

    //====== handle click get all task =====//
    function handleClickGetAllTaskApi(){

        if(location.pathname !== `/users/${userId}/tasks`){
            navigate(`/users/${userId}/tasks`)
        }


        dispatch(getAllTodoApiAsync());
        toggleShowSidebar();
    }

  
    //====== handle logout click ========//
   async function handleLogoutClick(){
        dispatch(logoutApiAsync());
        toast.success("logout successfully")
    }

    return (
        <>
            {user && (
                <div className={`${styles.userProfileContainer} ${isShowSidebar ? styles.showProfile : ''}`}>
                    <div className={styles.profileHeader}>
                        <img 
                            src="https://images.pexels.com/photos/3777564/pexels-photo-3777564.jpeg?cs=srgb&dl=pexels-olly-3777564.jpg&fm=jpg" 
                            alt="User" 
                            className={styles.profileImage} 
                        />
                        <h3 className={styles.userName}>{user?.name}</h3>
                    </div>

                    <ul className={styles.profileMenu}>
                        <li>
                            <Link to={`/users/${user._id}/tasks/add-task`}>
                                <LuListTodo className={styles.icons} /> Add Task
                            </Link>
                        </li>

                        <li onClick={handleClickGetCompletedtask}>                   
                            <AiOutlineFileDone className={styles.icons} /> Complete Task                    
                        </li>

                        <li onClick={handleClickGetAllPendingTask}>
                            <MdPendingActions className={styles.icons} /> Pending Task
                        </li>

                        <li onClick={handleClickGetAllTaskApi}>
                            <TiHeartFullOutline className={styles.icons}/> All Task
                        </li>

                        <li>
                            <ImHistory className={styles.icons}/> Search History
                        </li>

                        <li>
                            <IoMdSettings className={styles.icons} /> Settings
                        </li>

                        <li onClick={handleLogoutClick}>
                            <MdLogout className={styles.icons} /> Logout
                        </li>
                    </ul>

                    <div className={styles.closeBtn} onClick={toggleShowSidebar}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
            )}
        </>
    );
   
}
