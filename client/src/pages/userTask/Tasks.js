import styles from "./Tasks.module.css";
import { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdPending } from "react-icons/md";
import { getAllTodoApiAsync, todoSelector, deleteTodoApiAsync, markTodoCompleteApiAsync } from "../../redux/todoReducer";
import { useDispatch, useSelector } from "react-redux";
import { loadingSelector } from "../../redux/loaderReducer";
import { errorSelector, clearError } from "../../redux/errorReducer";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Tasks() {
    const { todos } = useSelector(todoSelector);
    const dispatch = useDispatch();
    const { errorMessage } = useSelector(errorSelector);
    const { loading } = useSelector(loadingSelector);
    const params = useParams();

   

    // Show toast error if any error and clear the error after a few seconds
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, dispatch]);

    // Dispatch get all todos on component mount
    useEffect(() => {
        dispatch(getAllTodoApiAsync());
    }, [dispatch]);


    //===== function handle click delete todo =======//
   async function handleClickDeleteTodo(taskId){
        try{
            const result = await dispatch(deleteTodoApiAsync({taskId:taskId}));
            if(result.type==='todo/deleteTodoApi/fulfilled'){
                toast.success("Task is deleted.");
            }

        }catch(error){
            toast.error(error);
        }
        
    }

    //====== handle click mark todo complete ========//
    async function handleClickMarkTodoComplete(todo){
        try{
            if(todo.completed){
                toast.error("Task is already marked as complete!");
                return;
            }

            const result = await dispatch(markTodoCompleteApiAsync({todoId:todo._id}));
            console.log("result for mark todo: ", result);
            if(result.type==='todo/markTodoApi/fulfilled'){
                toast.success("Todo is Completed!");
            }

        }catch(error){
            toast.error(error);
        }
        
    }

    return (
        <div className={styles.taskContainer}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <ClipLoader color="#4A90E2" size={50} />
                </div>
            ) : todos.length === 0 ? (
                <p className={styles.noTodosMessage}>No todos available. Please add some tasks.</p>
            ) : (
                todos.map((todo) => (
                    <div key={todo._id} className={styles.taskBox}>
                        <div className={styles.leftTaskBox}>
                            <p className={styles.taskName}>{todo.title}</p>
                            <p className={styles.dueDate}>{todo.dueDate}</p>
                            <p className={styles.todoStatus}>
                                {todo.completed ? (
                                    <IoIosCheckmarkCircle onClick={()=>handleClickMarkTodoComplete(todo)}
                                     className={styles.completedMark} />
                                ) : (
                                    <MdPending  onClick={()=>handleClickMarkTodoComplete(todo)}
                                     className={styles.pendingMark} />
                                )}
                                <span>{todo.completed ? "Completed" : "Pending"}</span>
                            </p>
                        </div>
                        <div className={styles.middleTaskBox}>
                            <p className={styles.taskDescription}>{todo.desc}</p>
                        </div>
                        <div className={styles.rightTaskBox}>

                            <Link to={`/users/${params.userId}/tasks/edit-task/${todo._id}`}>
                                 <FaEdit className={styles.editTask} />
                            </Link>
                          
                            <MdDeleteForever onClick={()=>handleClickDeleteTodo(todo._id)}
                             className={styles.deleteTask} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
