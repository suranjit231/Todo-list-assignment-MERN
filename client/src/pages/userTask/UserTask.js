import styles from "./UserTask.module.css";
import { useParams, Link } from "react-router-dom";
import UserSidebar from "../../components/sidebar/Sidebar";
import { IoSearchSharp } from "react-icons/io5";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchTodoApiAsync } from "../../redux/todoReducer";
import { useDispatch } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUserTask } from "../../utils/UserTaskContext";
import { IoIosArrowRoundBack } from "react-icons/io";


//========= user special task page =========//
export default function UserTaskPage(){
    const params = useParams();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");

     //====== consume userTask context =====//
     const {isShowSidebar, toggleShowSidebar, isSearchBar, toggleSearchBar, isMobile } = useUserTask();


    //======= search the todo implemnts here =====//
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchText) {
                dispatch(searchTodoApiAsync({searchText:searchText}));
            }
        }, 300); 
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchText, dispatch]);

   
 

    return(

        <>
        
        <div className={styles.userTaskPageContainer}>
            <UserSidebar />

            {/* ========= tasks page header section ============= */}
            <div className={styles.taskPageWrapper}>
                <div className={styles.mainHeaderSection}>

                    

                        { !isSearchBar && <GiHamburgerMenu onClick={toggleShowSidebar}
                        className={`${styles.menuIcon} ${isSearchBar?styles.hide:""}`} />}

                    <div className={styles.searchDiv}>
                        <input value={searchText} onChange={(e)=>setSearchText(e.target.value)}
                         type="text" placeholder="Search todo..." className={styles.searchInput} />
                        <IoSearchSharp className={styles.searchIcon} />
                    </div>

                    { isSearchBar && isMobile &&  <div className={styles.searchDivRespons}>
                        <input value={searchText} onChange={(e)=>setSearchText(e.target.value)}
                         type="text" placeholder="Search todo..." className={styles.searchInput} />
                        <IoSearchSharp className={styles.searchIcon} />

                        <IoIosArrowRoundBack onClick={()=>toggleSearchBar()}
                         className={styles.searchBackIcons} />
                    </div>}

                    

                     { !isSearchBar && <IoSearchSharp onClick={()=>toggleSearchBar()}
                     className={styles.searchControlIcon} />}

                </div>


                <Outlet />

            </div>
        </div>
    </>)
}