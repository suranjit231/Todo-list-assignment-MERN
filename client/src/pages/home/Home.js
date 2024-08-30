import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const HomePage = () => {

  return (

    <div className={styles.homeContainer}>
    <h1 className={styles.typingAnimation}>Welcome to Your Todo List</h1>

    <button className={styles.startButton}>
       <Link to={"/users/signin"} className={styles.loginLink}>Get Started</Link>
    </button>

  </div>

   

  );
};

export default HomePage;
