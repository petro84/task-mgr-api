const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Larry',
            email: 'larrypetroski@gmail.com',
            password: 'Lowell12!'
        })
        .expect(201)

        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

        expect(response.body).toMatchObject({
            user: {
                name: 'Larry',
                email: 'larrypetroski@gmail.com'
            },
            token: user.tokens[0].token
        })

        expect(user.password).not.toBe('Lowell12!')
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'joe@momma.com',
            password: 'biteME123!'
        })
        .expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get unaunthenticated user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated profile', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mike Hunt'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Mike Hunt')
})

test('Should not update invlaid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'home'
        })
        .expect(400)
})