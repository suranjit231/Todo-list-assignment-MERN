import mongoose from "mongoose";
import moment from "moment";

//============= schema definition for task =====================//
const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: [true, "Title is required!"],
        trim: true,
        unique: [true, "Task already exists!"],
    },

    desc: {
        type: String,
        trim: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },

    dueDate: {
        type: Date,
        validate: {
            validator: function (value) {
                //----- Validate only if the task is not marked as completed -----//
                return this.isNew || !this.completed
                    ? moment(value).isSameOrAfter(moment().startOf("day"))
                    : true;
            },
            message: "Due date must be a future date.",
        },
    },
}, { timestamps: true });

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
