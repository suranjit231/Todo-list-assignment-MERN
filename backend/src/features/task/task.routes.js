//====================== taskRoutes file for all task operation =======================//
import express from "express";
import TaskController from "./task.controller.js";


const taskRoutes = express.Router();
const taskController = new TaskController();


//=========== create a new task routes ===============//
taskRoutes.post("/createTask", (req,res,next)=>{
    taskController.createTask(req,res,next);
});

//============= marks task complete ==================//
taskRoutes.put("/markTask/:taskId", (req,res,next)=>{
    // console.log("markTask is called: ", req);
    taskController.markTaskComplete(req,res,next);
});

//============= view all the task ===================//
taskRoutes.get("/viewAllTask", (req,res,next)=>{
    taskController.viewAllTask(req,res,next);
});

//============= view all the pending task ===========//
taskRoutes.get("/pendingTask", (req,res,next)=>{
    taskController.viewAllPendingTask(req,res,next);
});

//========== get all completed task =============//
taskRoutes.get("/completedTask", (req,res,next)=>{
    taskController.viewCompletedTask(req,res,next);
})


//============= update a task =====================//
taskRoutes.put("/updateTask/:taskId", (req,res,next)=>{
    taskController.updateTask(req,res,next);
});

//============ delete a task ======================//
taskRoutes.delete("/deleteTask/:taskId", (req,res,next)=>{
    taskController.deleteTask(req,res,next);
})


//============ search a task =======================//
taskRoutes.get("/search", (req,res,next)=>{
    taskController.searchTask(req,res,next);
})

export default taskRoutes;