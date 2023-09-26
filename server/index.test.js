const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);
const util = require('./utils.js');

const a = {
	"username": "admin",
	"password": "password",
	"task": "This is a sample task",
	"deadline": "2024-01-01 23:59:59",
	"taskid": 1,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NTc1NDkyNjg0MiwiZXhwIjoxNjk4MzQ2OTI2ODQyLCJ1c2VyIjoiYWRtaW4iLCJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEifQ.QBjIjvL5oxGxhipbJjYm7WoCiIlCAHA6kP5iuMJk4AQ="
};

const b = {
	"username": "fail",
	"password": "fail",
	"task": "This is a sample task",
	"deadline": "2024-01-01 23:59:59",
	"taskid": 18,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};

const c = {
	"username": "admin",
	"password": "fail",
	"task": "This is a sample task",
	"deadline": "2024-01-01 23:59:59",
	"taskid": 18,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};

const d = {
	"username": "test",
	"password": "test",
	"task": "This is a sample task",
	"deadline": "2024-01-01 23:59:59",
	"taskid": 18,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};

function deleteUser (user) {
    let conn = util.createConnection();
    conn.query('delete from tasks where username = ?', [user], (error, results, fields) => {});
    conn.query('delete from users where username = ?', [user], (error, results, fields) => {});
    conn.end();
}

test('Basic test of default endpoint', async () => {
    let res = await request.get('/');
    res = res.body;
    expect(res.user).toEqual('test');
});

test('Login with correct credentials returns true', async () => {
    let res = (await request.post('/login').send(a));
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Login with incorrect username returns false', async () => {
    let res = (await request.post('/login').send(b));
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Login with incorrect password returns false', async () => {
    let res = (await request.post('/login').send(c));
    res = res.body;
    expect(res.success).toEqual(false);
});

test('JWT returns the user that created the JWT', async () => {
    let res = (await request.post('/jwt').send(a));
    res = res.body;
    expect(res.user).toEqual('admin');
});

test('Verify returns the validity of the JWT', async () => {
    let res = (await request.post('/verify').send(a));
    res = res.body;
    expect(res.valid).toEqual(true);
});

test('Signup with a new account return true', async () => {
    //TODO: Make a delete account function to properly implement this test
    let res = (await request.post('/signup').send(d));
    res = res.body;
    deleteUser(d.username);
    expect(res.success).toEqual(true);
});

test('Signup with existing account returns false', async () => {
    let res = (await request.post('/signup').send(a));
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Posting task to existing user returns true', async () => {
    let res = (await request.post('/taskS').send(a));
    res = res.body;
    expect(res.success).toEqual(true);
    (await request.post('/delete').send(a));
});

test('Posting task to non-existent user returns false', async () => {
    let res = (await request.post('/task').send(b));
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Deleting a task returns true', async () => {
    (await request.post('/taskS').send(a));
    let res = (await request.post('/delete').send(a));
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Deleting an non-existent task returns false', async () => {
    let res = (await request.post('/delete').send(b));
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Usertask returns all tasks from a user', async () => {
    let res = (await request.post('/usertask').send(a));
    res = res.body;
    expect(res.success).toEqual(true);
});