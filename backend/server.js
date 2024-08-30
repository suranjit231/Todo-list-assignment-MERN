import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectMongodb from "./src/config/connectMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./src/utility/errorHandler.js";
import userRoutes from "./src/features/users/user.routes.js";
import taskRoutes from "./src/features/task/task.routes.js";
import { auth } from "./src/middleware/jwtAuth.middleware.js";




const app = express();

//======== setup middleware for request data parsing ==========//
//======== setup middleware for request data parsing ==========//
app.use(cors({
    origin: 'https://todo-list-assignment-mern-client-iml6mg5nw.vercel.app',
    
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//======== handling routes for different feature routes =======//
app.use("/api/users", userRoutes);

app.use("/api/tasks", auth, taskRoutes);




//========= error response for invalid path ===================//
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Invalid path please refer our documentaion on localhost:3200/api-docs" });
});


//======== Add the error handler middleware ==============//
app.use(errorHandler);


//========= listening in port ===============================//
const PORT = process.env.PORT;



app.listen(PORT, ()=>{
    console.log(`app is listen on port ${PORT}`);
    connectMongodb();
})
