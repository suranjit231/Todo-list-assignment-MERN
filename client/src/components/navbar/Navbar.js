import styles from "./Navbar.module.css";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar(){

    return(

        <>
        <div className={styles.navbarContainer}>
           
                <div className={styles.leftNavbar}>ToDo List</div>

                <Link to={"/users/signin"} className={styles.loginLink}>
                    <div className={styles.rightNavbar}>
                        Login
                    </div>
                </Link>
               
            
        </div>


        {/* ====== provide outlet here ======== */}

        <Outlet />

        </>
    )
}