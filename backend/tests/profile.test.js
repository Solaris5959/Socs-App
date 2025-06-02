// small tests to confirm that various aspects of our health check route work

// tests/unit/health.test.js

import request from 'supertest';
import app from '../src/server';
const user= {
    email: process.env.AUTH_USER, 
    password: process.env.AUTH_PASS, 
};
describe('/ profile routes', () => {


    test('GET Query user data', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const profile = await request(app)
        .get('/socs/api/v1/index/profile/') 
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(profile.statusCode).toBe(200);
        expect(profile.body.email).toBeDefined();
        expect(profile.body.display_name).toBeDefined();
    });

    test('Update with missing NOT NULL Fields', async () => {
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user)
        expect(login.statusCode).toBe(200);
        expect(login.body.message).toBe("User logged in successfully")
    
        const profile = await request(app)
        .put('/socs/api/v1/index/profile/') // Access the protected route
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        });
        expect(profile.statusCode).toBe(422);
        expect(profile.body.error).toBe("Display_name or email fields missing for body")
    });

    
    test('valid profile PUT with missing nullable fields', async () => {
        const fields = {
            display_name : "Audrey Tester",
            company: "Seneca College",
            visibility:"public",
            email: user.email,
            firstName: "Test",
            lastName: "Test",
            position : "Student"
        };
        const login = await request(app).post('/socs/api/v1/user/login')
        .send(user)

    
        const updated_profile = await request(app)
        .put('/socs/api/v1/index/profile/') // Access the protected route
        .set({
            'Authorization': `Bearer ${login.body.session.access_token}`,
            'Content-Type': 'application/json'
        })
        .send(fields);
        expect(updated_profile.statusCode).toBe(200);
        expect(updated_profile.body.user_id).toBe(login.body.session.user.id);
        expect(updated_profile.body.company).toBe("Seneca College");
        expect(updated_profile.body.first_name).toBe("Test")
        expect(updated_profile.body.phone_number.length).toBe(0);
    });

    

});
