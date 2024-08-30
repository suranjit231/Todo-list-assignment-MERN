import styles from "./LoginForm.module.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApiAsync, authSelector } from "../../redux/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { errorSelector, clearError } from "../../redux/errorReducer";
import { loadingSelector } from "../../redux/loaderReducer";
import { ClipLoader } from "react-spinners";

export default function SignupForm() {

   //----------- local state -----------// 
  const [isPassword, setPasswordToggle] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [passwordValidate, setPasswordValidate] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const nameRef = useRef();
  const [isSignup, setSignup] = useState(false);
  const navigate = useNavigate();

  //-------- redux state ----------//
  const dispatch = useDispatch();
  const {errorMessage} = useSelector(errorSelector);
  const { loading } = useSelector(loadingSelector);
  


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



  //===== foucs on name field ====//
  useEffect(() => {
    nameRef.current.focus();
  }, []);


  //===== validate form input =====//
  useEffect(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const emailRegex = /.+\@.+\../;

    setEmailValidate(emailRegex.test(email));
    setPasswordValidate(passwordRegex.test(password));

    // Enable button if all validations are met
    setIsButtonDisabled(
      !(name.length >= 3 && emailValidate && passwordValidate)
    );
  }, [name, email, password, emailValidate, passwordValidate]);

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  //======== if isSignUp then navigate to login page ====//
  useEffect(()=>{
    if(isSignup){
        navigate("/users/signin");
    }

  },[isSignup]);



  //======== function handle auth form submit ==========//
  const handleAuthFormSubmit = async (e) => {
    e.preventDefault();
    try{
        if(!name || !email || !password){
           toast.error("required input is missing");
           return ;
        }
        
        if(name.length<3 || !emailValidate || !passwordValidate) {
             toast.error("Invalid data.");
             return;
        }

        //======= dispatch signup api ======//
        const result = await dispatch(signupApiAsync({name:name, email:email, password:password}));
        console.log("result for signup form submit: ", result.type);
        if(result.type==="auth/signupApi/fulfilled"){
          setSignup(true);
          toast.success("signup successfully.");
          clearInput();
        }

    }catch(error){
        console.log("error in signup form: ", error);
    }
    
  };


  // ======== clear input ========//
  function clearInput(){
    setName("");
    setEmail("");
    setPassword("");
  }

  const getInputClassName = (touched, isValid) => {
    if (!touched) return styles.defaultInput;
    return isValid ? styles.successInput : styles.errorInput;
  };

  return (
    <div className={styles.signupFormContainer}>
      <form onSubmit={handleAuthFormSubmit} className={styles.authForm}>
        <h2>Sign Up</h2>

        <div className={styles.formControl}>
          <label htmlFor="name">
            <FaUser className={styles.formLabel} />
          </label>
          <input
            className={name.length > 3 ? styles.successInput : styles.errorInput}
            value={name}
            ref={nameRef}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            placeholder="Name..."
          />
        </div>

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

        
        {/* ======= button for submit form ========= */}
        <button

          className={`${styles.formSubmitBtn} ${!isButtonDisabled ? styles.activeSubmitBtn : ''}`}
          disabled={isButtonDisabled || loading}>
          {loading ? <ClipLoader size={15} color={"#fff"} /> : "Sign Up"}

        </button>


        <p className={styles.formRedirectionBtn}>
          Already have an account?
            <span>
                <Link to={"/users/signin"} className={styles.loginLink}>Login</Link>
            </span>
        </p>


      </form>
    </div>
  );
}
