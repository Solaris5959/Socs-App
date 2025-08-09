import request from 'supertest';
import app from '../src/server';
const user1= {
    email: process.env.AUTH_USER, 
    password: process.env.AUTH_PASS, 
};

describe('/ chat routes', () => {
    test('Send a message', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        const msg = {
            sender_id: login.body.session.user.id,
            receiver_id: "69f0a1d4-3273-4836-a1ab-6ffd797bb67c",
            content: "Test message",
        };
    
        const newMsg = await request(app)
        .post('/socs/api/v1/index/chat/') // Access the protected route
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        })
        .send(msg);
        expect(newMsg.statusCode).toBe(200);
        expect(newMsg.body.content).toBe(msg.content);
        expect(newMsg.body.receiver_id).toBe(msg.receiver_id);
    });

    test('Get message history with user', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const messages = await request(app)
        .get('/socs/api/v1/index/chat/' + '69f0a1d4-3273-4836-a1ab-6ffd797bb67c')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(messages.statusCode).toBe(200);
        expect(messages.body.length).toBeGreaterThan(0);


    });
    test('Update a message sent', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const messages = await request(app)
        .get('/socs/api/v1/index/chat/' + '69f0a1d4-3273-4836-a1ab-6ffd797bb67c')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });

        const update = await request(app)
        .put('/socs/api/v1/index/chat/' + messages.body[0].id)
        .send({content:"updated msg"})
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(update.statusCode).toBe(200);
    });

    test('Updating or new message without content', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
        const messages = await request(app)
        .get('/socs/api/v1/index/chat/' + '69f0a1d4-3273-4836-a1ab-6ffd797bb67c')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });

        //update
        const update = await request(app)
        .put('/socs/api/v1/index/chat/' + messages.body[0].id)
        .send({missing:"updated msg"})
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(update.statusCode).toBe(400);
        //new
        const newMsg = await request(app)
        .post('/socs/api/v1/index/chat/') // Access the protected route
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        })
        expect(newMsg.statusCode).toBe(400);

    });
        test('GET all messages', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const messages = await request(app)
        .get('/socs/api/v1/index/chat')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(messages.statusCode).toBe(200);
        expect(messages.body[0]).toHaveProperty('profile_data');

    });
    test('Delete a message sent', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user1)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const messages = await request(app)
        .get('/socs/api/v1/index/chat/' + '69f0a1d4-3273-4836-a1ab-6ffd797bb67c')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });

        const del = await request(app)
        .del('/socs/api/v1/index/chat/' + messages.body[0].id)
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(del.statusCode).toBe(204);
        
        const not_exist = await request(app)
        .get('/socs/api/v1/index/chat/' + '69f0a1d4-3273-4836-a1ab-6ffd797bb67c')
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(not_exist.body).not.toContain(messages.body[0].id);
    });
    

});
