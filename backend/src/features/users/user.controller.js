import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";

//================= a controller class for which contain all user related methods ===========//

export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
    }


    //============== user signup controller ==================//
    async signup(req,res,next){
        try{
            const userData = req.body;
            console.log("signup req.body: ", userData);
            const signupResult = await this.userRepository.signup(userData);

            if(!signupResult.success){
                res.status(404).json(signupResult.msg);

            }else{
                res.status(201).json(signupResult);
            }

        }catch(error){
           // console.log("user signup controller error: ", error);
            return res.status(404).json(error.msg);
        }
    }


    //============ user signin controller ============//
    async signin(req,res,next){
        try{
            const {email, password} = req.body;

            console.log("login req.body: ", req.body);


            if(!email || !password){
                return res.status(404).json({success:false, msg:"Please enter email and password!"});
            }

            const signinResult = await this.userRepository.signin(email, password);
            if(!signinResult.success){
                return res.status(404).json(signinResult.msg);
            }

            const token=jwt.sign({
                userId:signinResult.removedPasswordUser._id,
                email:signinResult.removedPasswordUser.email
               }, process.env.JWT_SECRET, { expiresIn: '3h' });

            return res.status(200)
                .cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true, secure: true, 
                sameSite: 'None' })
                .json({sucess:true,signinResult,token});

        }catch(error){
           // console.log("user signup controller error: ", error);
            return res.status(404).json(error.msg);
        }
    }

     //========== user logout controller ============//
     async logout(req,res,next){
        try {
           
            res.clearCookie('jwtToken').status(200).json({success:true, msg:"logout sucessful"});
        } catch (error) {
            console.log("error logout: ", error)
        }
    }
}
