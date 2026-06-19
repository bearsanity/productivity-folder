const verifyToken = require('../middleware/auth');
const Task = require('../models/Task');
const router = require('express').Router()

//============================= Controllers =============================
const createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, userId: req.user.userId });
        return res
            .status(201)
            .json({ task });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: "Failed to create task" })
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        return res.json(tasks);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Failed to get tasks', error: err.message });
    }
};

const getOneTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res
                .status(404)
                .json({ message: "Can't find task with that ID" });
        }
        return res.json(task);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Failed to fetch Task", error: err.message });
    }
};

const updateOneTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!task) {
            return res
                .status(404)
                .json({ message: "No task found with that id" })
        }
        return res.json(task);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Failed to fetch Task", error: err.message });
    }
};

const deleteOneTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskId);
        if (!task) {
            return res
                .status(404)
                .json({ message: "No task found with that id" })
        }
        return res.json(task);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Failed to fetch Task", error: err.message });
    }
};

const completeTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { $push: { completionHistory: Date.now() } },
            { runValidators: true, new: true }
        );

        if (!task) {
            return res
                .status(404)
                .json({ message: "No task found with that id" })
        }
        return res.json(task);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Failed to fetch Task", error: err.message });
    }
};

//============================= Routes ============================= 
router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.get('/:taskId', verifyToken, getOneTask);
router.put('/:taskId', verifyToken, updateOneTask);
router.delete('/:taskId', verifyToken, deleteOneTask);
router.put('/:taskId/complete', verifyToken, completeTask);
//router.delete('/', verifyToken, deleteAllTasks)

module.exports = router