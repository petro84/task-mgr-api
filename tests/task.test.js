const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOne, userTwo, taskOne, taskTwo, taskThree, setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Get groceries'
        })
        .expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)
})

test('Should fetch userOne tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete task for different user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authrization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(401)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})