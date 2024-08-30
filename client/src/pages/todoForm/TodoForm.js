import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addTodoApiAsync, updateTodoApiAsync, todoSelector } from "../../redux/todoReducer";
import { loadingSelector } from "../../redux/loaderReducer";
import { errorSelector, clearError } from "../../redux/errorReducer";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import styles from "./TodoForm.module.css";

export default function TodoForm() {
    const { todos } = useSelector(todoSelector);
    const { loading } = useSelector(loadingSelector);
    const { errorMessage } = useSelector(errorSelector);
    const { userId, todoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [desc, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("edit-task")) {
            setIsEdit(true);
            const todoToEdit = todos.find(todo => todo._id === todoId);
            if (todoToEdit) {
                setTitle(todoToEdit.title);
                setDescription(todoToEdit.desc);
                setDueDate(formatDateToYyyyMmDd(todoToEdit.dueDate));
            }
        } else {
            setIsEdit(false);
        }
    }, [location.pathname, todoId, todos]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !desc || !dueDate) {
            toast.error("Required input is missing.");
            return;
        }

        try {
            if (isEdit) {
                const result = await dispatch(updateTodoApiAsync({ todoId, title, desc, dueDate }));
                if (result.type === 'todo/updateTodoApi/fulfilled') {
                    toast.success("Todo updated successfully.");
                    navigate(`/users/${userId}/tasks`);

                    clearInput();
                }
            } else {
                const result = await dispatch(addTodoApiAsync({ title, desc, dueDate }));
                if (result.type === 'todo/addTodoApi/fulfilled') {
                    toast.success("A new Task is added")
                    clearInput();
                }
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const clearInput = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
    };


    function formatDateToYyyyMmDd(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>Title</label>
                <input
                    type="text"
                    id="title"
                    className={styles.formInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="desc" className={styles.formLabel}>Description</label>
                <textarea
                    id="desc"
                    className={styles.formTextarea}
                    value={desc}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="dueDate" className={styles.formLabel}>Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    className={`${styles.formInput} ${styles.dateInput}`}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>

            <button className={styles.submitButton} type="submit" disabled={loading}>
                {loading ? <ClipLoader size={15} color={"#fff"} /> : isEdit ? "Update Todo" : "Add Todo"}
            </button>
        </form>
    );
}
