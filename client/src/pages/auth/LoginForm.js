import styles from "./LoginForm.module.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {ClipLoader} from "react-spinners";
import {toast } from "react-toastify";
import { loginApiAsync, authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loaderReducer";
import { errorSelector, clearError } from "../../redux/errorReducer";
import {useSelector, useDispatch} from "react-redux";



export default function LoginForm() {
  const [isPassword, setPasswordToggle] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [passwordValidate, setPasswordValidate] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const emailRef = useRef();

  //====== redux states ========//
  const dispatch = useDispatch();
  const {isLoggedIn, user} = useSelector(authSelector);
  const {errorMessage} = useSelector(errorSelector);
  const { loading } = useSelector(loadingSelector);

  const location = useLocation();
  // const from = location.state?.from?.pathname || `/users/${user?._id}/tasks`;
  const navigate = useNavigate();

 // console.log("user: ", user)



 //======= Show toast error if any error and clear the error after a few seconds =====//
 useEffect(() => {
  if (errorMessage) {
    toast.error(errorMessage);

    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 4000); 

    return () => clearTimeout(timer);
  }
}, [errorMessage, dispatch]);

 //========= if loggedIn successfully then redirect to the home page ====//
 useEffect(() => {
  if (isLoggedIn && user && user._id) {

    const from = location.state?.from?.pathname || `/users/${user._id}/tasks`;
      navigate(from, { replace: true });
  }
}, [isLoggedIn, navigate, user?._id]);

  // ---- focus input fields ----//
  useEffect(() => {
    emailRef.current.focus();
  }, []);


  // ======= validate input fields ========//
  useEffect(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const emailRegex = /.+\@.+\../;

    setEmailValidate(emailRegex.test(email));
    setPasswordValidate(passwordRegex.test(password));

  }, [email, password, emailValidate, passwordValidate]);

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };


  const getInputClassName = (touched, isValid) => {
    if (!touched) return styles.defaultInput;
    return isValid ? styles.successInput : styles.errorInput;
  };


  // ========= handle login form submit =========//
  const handleAuthFormSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      toast.error("required input data.");
      return;
    }

    try{

      const result = await dispatch(loginApiAsync({email:email, password:password}));
      console.log("result for login form: ", result);

      if(result.type==="auth/loginApi/fulfilled"){
        toast.success("login sucessfully");
        clearInput()
      }

    }catch(error){
      toast.error(error);
    }
  };


  //======= clear input fileds =====//
  function clearInput(){
    setEmail("");
    setPassword("");
  }



  return (
    <div className={styles.signupFormContainer}>
      <form onSubmit={handleAuthFormSubmit} className={styles.authForm}>
        <h2>Login</h2>

        <div className={styles.formControl}>
          <label htmlFor="email">
            <MdEmail className={styles.formLabel} />
          </label>
          <input
            className={getInputClassName(emailTouched, emailValidate)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            placeholder="Email..."
            onFocus={handleEmailBlur}
            ref={emailRef}
          />
        </div>

        <div className={`${styles.formControl} ${styles.passwordContainer}`}>
          <label htmlFor="password">
            <MdLock className={styles.formLabel} />
          </label>
          <input
            className={getInputClassName(passwordTouched, passwordValidate)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isPassword ? "password" : "text"}
            id="password"
            placeholder="Password..."
            onFocus={handlePasswordBlur}
          />

          <div
            onClick={() => setPasswordToggle((prev) => !prev)}
            className={styles.passwordControl}
          >
            {isPassword ? (
              <FaEyeSlash className={styles.hidePassword} />
            ) : (
              <FaEye className={styles.showPassword} />
            )}
          </div>
        </div>


        {/* ========== login form submit button ======= */}
        <button className={`${styles.formSubmitBtn} ${styles.loginFormBtn}`}
              type="submit" disabled={loading}>
              {loading ? <ClipLoader size={15} color={"#fff"} /> :"Login"}

        </button>




        <p className={styles.formRedirectionBtn}>
          Don't have an account?
          <span>
            <Link to={"/users/signup"} className={styles.loginLink}>Sign Up</Link>
          </span>
        </p>


      </form>
    </div>
  );
}
