const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/task', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Pagination
// GET /task?completed=false
// GET /task?limit=10&skip=10 //second page 
// GET /task?sortBy=createdAt_desc
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id })
        // OR
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                //completed: -1 // 1: ascending order of createdAt field; -1: descending order of createdAt field
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }

})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {

        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isAllowedUpdate) {
        return res.status(400).send({ error: 'Invalid Updates! :/' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router
