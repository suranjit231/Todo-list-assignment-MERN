import mongoose from "mongoose";
import taskModel from "./taskSchema.js";
import userModel from "../users/userSchema.js";
import handleError from "../../utility/errorHandler.js";
import moment from "moment";


//======== a ropository class contains methods for all task operations ==========//

export default class TaskRepository{

     //========= create a new task =========//
     async createTask(taskDetails) {
        try {
            const user = await userModel.findById(taskDetails.user);
            if (!user) {
                return { success: false, msg: "User not found!" };
            }

            const newTask = new taskModel(taskDetails);
            let savedTask = await newTask.save();

            user.tasks.push(savedTask._id);
            await user.save();

            //======== formatting the task ===================//
            savedTask = {
                ...savedTask.toObject(),
                dueDate: moment(savedTask.dueDate).format('D MMM YYYY'),
            };

            return { success: true, msg: "Task created successfully!", task: savedTask };
        } catch (error) {
            return handleError(error);
        }
    }

    //=========== mark the task as complete ============//
    async markTaskComplete(taskId, userId) {
        try {
            const task = await taskModel.findOne({ _id: taskId, user: userId });
            if (!task) {
                return { success: false, msg: "Task not found or you are not authorized to complete this task!" };
            }

            if (task.completed) {
                return { success: false, msg: "Task is already marked as complete!" };
            }

            task.completed = true;
            await task.save();

            return {
                success: true,
                msg: "Task marked as complete!",
                task: {
                    ...task.toObject(),
                    dueDate: moment(task.dueDate).format('D MMM YYYY'),
                },
            };
        } catch (error) {
            return handleError(error);
        }
    }

    //============ update a task ============//
    async updateTask(userId, taskId, updateAbleData) {
        try {
            const task = await taskModel.findById(taskId);
            if (!task) {
                return { success: false, msg: "Task not found!" };
            }

            if (task.user.toString() !== userId) {
                return { success: false, msg: "You are not authorized to update this task!" };
            }

            for (const key in updateAbleData) {
                task[key] = updateAbleData[key];
            }

            const updatedTask = await task.save();
            return {
                success: true,
                msg: "Task is updated successfully",
                task: {
                    ...updatedTask.toObject(),
                    dueDate: moment(updatedTask.dueDate).format('D MMM YYYY'),
                },
            };
        } catch (error) {
            return handleError(error);
        }
    }


    //========== delete a task ============//
    async deleteTask(taskId, userId){
        try{
            const task = await taskModel.findById(taskId);
            const user = await userModel.findById(userId);
            if(!task){
                return {success:false, msg:"task not found!"}
            }

            if(task.user.toString() !== userId.toString()){
                return {success:false, msg:"You are not authorized to remove this task!"}
            }

            const deleteResult = await taskModel.deleteOne({_id:taskId});
            if(deleteResult.deletedCount>0){
                user.tasks.pull(taskId);
                await user.save();
                return {success:true, msg:"Task removed sucessfully!"};
            }else{
                return {success:false, msg:"Task could not be removed!"};
            }


        }catch(error){
           // console.log("delete task error: ", error);
            return handleError(error);
        }
    }


    //============ view all the tasks of users ===========//
    async viewAllTask(userId){
        try{
            const tasks = await taskModel.find({user: userId}).sort({dueDate:1});
            if(tasks.length < 1){
                return {success: false, msg: "No task found!", tasks:[]};
            } else {
                const formattedTasks = tasks.map(task => {
                    return {
                        ...task.toObject(),
                        dueDate: moment(task.dueDate).format('D MMM YYYY')
                    };
                });
                let totalTask = tasks.length;
                return {success: true, msg: `You have ${totalTask} tasks found`, tasks: formattedTasks};
            }
        }catch(error){
          // console.log("view all task repository error: ", error);
            return handleError(error);
        }
    }

   
    //========= view all pending task ==============//
async viewAllPendingTask(userId) {
    try {
        const tasks = await taskModel.find({ user: userId, completed: false }).sort({ dueDate: 1 });
        if (tasks.length < 1) {
            return { success: false, msg: "No pending tasks found!", tasks:[] };
        } else {
            const formattedTasks = tasks.map(task => {
                return {
                    ...task.toObject(),
                    dueDate: moment(task.dueDate).format('D MMM YYYY')
                };
            });
            let totalTask = tasks.length;
            return { success: true, msg: `You have ${totalTask} pending tasks found`, tasks: formattedTasks };
        }
    } catch (error) {
        return { success: false, msg: "An error occurred while fetching tasks." };
    }
}





    //======= get all completd task ============//
    async viewCompletedTask(userId){
        try{

            const tasks = await taskModel.find({user:userId, completed:true}).sort({dueDate:1});
            if(tasks.length < 1){
                return {success: false, msg: "No completed task found!", tasks:[]};
            }else {
                const formattedTasks = tasks.map(task => {
                    return {
                        ...task.toObject(),
                        dueDate: moment(task.dueDate).format('D MMM YYYY')
                    };
                });
                let totalTask = tasks.length;
                return {success: true, msg: `You have ${totalTask} pending tasks found`, tasks: formattedTasks};
            }

        }catch(error){
            return handleError(error);
        }
    }

  
    //======== search task repository ======//
async searchTask(userId, searchText) {
    try {
        const tasks = await taskModel.find({
            user: userId,
            $or: [
                { title: new RegExp(searchText, 'i') },
                { description: new RegExp(searchText, 'i') }
            ]
        }).sort({ dueDate: 1 });

        if (tasks.length < 1) {
            return { success: false, msg: "No tasks found!", tasks:[] };
        } else {
            const formattedTasks = tasks.map(task => {
                return {
                    ...task.toObject(),
                    dueDate: moment(task.dueDate).format('D MMM YYYY')
                };
            });
            let totalTask = tasks.length;
            return { success: true, msg: `You have ${totalTask} tasks found`, tasks: formattedTasks };
        }
    } catch (error) {
        return { success: false, msg: "An error occurred while searching for tasks." };
    }
}

}