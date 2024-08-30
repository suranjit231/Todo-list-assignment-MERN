import TaskRepository from "./task.repository.js";


//============ a controller class contains all the methods related task (req/res) ======//

export default class TaskController{
    constructor(){
        this.taskRepository = new TaskRepository();
    }


    //====== handle create new task request ========//
    async createTask(req,res,next){
        try{
            const userId = req.userId;
            const taskData = req.body ;

            //----- check task title should't empty -----//
            if (!taskData.title || taskData.title.trim() === "") {
                return res.status(400).json({ success: false, message: "Title is required!" });
            }

            taskData.user = userId;
            const result = await this.taskRepository.createTask(taskData);
            if(!result.success){
                return res.status(404).json(result);

            }else{
                return res.status(201).json(result);
            }
    

        }catch(error){
            res.status(404).json(error.msg);
        }
    }


    //========== mark task complete =========//
    async markTaskComplete(req,res,next){
        try{
            const userId = req.userId;
            const taskId = req.params.taskId;

            console.log("req when mark of task: ", req.params.taskId);

            if(!taskId){
                return res.status(404).json({success:false, msg:"taskId is required to mark the task!"})
            }

            const result = await this.taskRepository.markTaskComplete(taskId, userId);
            if(!result.success){
                return res.status(404).json(result);
            }else{
                return res.status(200).json(result);
            }

        }catch(error){
            res.status(404).json(error);
        }
    }

    //============ update the task ================//
    async updateTask(req,res,next){
        try{
            const userId = req.userId;
            const taskId = req.params.taskId;
            const updateData = req.body;
            let errors = [];
            //======== checking the fields that can't updateable =======//
            for (const key in updateData) {
                if ([ "user", "userId"].includes(key.trim().toLowerCase())) {
                    errors.push(`Cannot update ${key}. Please refer to our documentation for details.`);
                }
            }

            if(errors.length>0){
                return res.status(404).json({success:false, msg:errors[0]});
            }

            const filteredUpdates = {};
            for(const key in updateData){
                console.log("key console: ", key);
                if(key.trim().toLowerCase() !== "taskid"){
                    filteredUpdates[key] = updateData[key];
                }
            }


            const result = await this.taskRepository.updateTask(userId, taskId, filteredUpdates);
            if(!result.success){
                return res.status(404).json(result);
            }else{
                return res.status(200).json(result);
            }


        }catch(error){
            res.status(404).json(error);
        }
    }

    //=========== delete a task ================//
    async deleteTask(req,res,next){
        try{
            const userId = req.userId;
            const taskId = req.params.taskId;

            if(!taskId){
                return res.status(404).json({success:false, msg:"Task Id is requied to delete a task!"});
            }

            const deleteResult = await this.taskRepository.deleteTask(taskId, userId);
            if(!deleteResult.success){
                return res.status(404).json(deleteResult);
            }else{
                return res.status(200).json(deleteResult);
            }

        }catch(error){
            res.status(404).json(error);
        }

    }


    //============ view all the user task ===========//
    async viewAllTask(req,res,next){
        try{
            const userId = req.userId;
            const tasks = await this.taskRepository.viewAllTask(userId);

            if(!tasks.success){
                return res.status(404).json(tasks);
            }else{
                return res.status(200).json(tasks);
            }

        }catch(error){
            res.status(404).json(error);
        }
    }


    //======== view all pending task ==========//
async viewAllPendingTask(req, res, next) {
    try {
        const userId = req.userId;
        const tasks = await this.taskRepository.viewAllPendingTask(userId);

        if (tasks) {
            return res.status(200).json(tasks);
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: "An error occurred while fetching tasks." });
    }
}






    //========== get all task completed task =========//
    async viewCompletedTask(req,res,next){
        try{
            const userId = req.userId;

            const tasks = await this.taskRepository.viewCompletedTask(userId);

            if(tasks){
                return res.status(200).json(tasks);
            }


        }catch(error){
            res.status(404).json(error);
        }
    }



    //========= search a task controller =========//
async searchTask(req, res, next) {
    try {
        const userId = req.userId;
        const searchText = req.query.q;

        const tasks = await this.taskRepository.searchTask(userId, searchText);
        console.log("task found in controller: ", tasks);

        if (tasks) {
            return res.status(200).json(tasks);
        }
        
    } catch (error) {
        res.status(500).json({ success: false, msg: "An error occurred while searching for tasks." });
    }
}





}