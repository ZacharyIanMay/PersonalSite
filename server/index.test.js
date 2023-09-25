const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);

const a = {
	"username": "test",
	"password": "password",
	"task": "This is a sample task",
	"deadline": "2024-01-01 23:59:59",
	"taskid": 18,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
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

test('Basic test of default endpoint', async () => {
    let res = await request.get('/');
    res = res.body;
    expect(res.user).toEqual('test');
});

test('Login with correct credentials returns true', async () => {
    let res = (await request.post('/login')).send(a);
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Login with incorrect username returns false', async () => {
    let res = (await request.post('/login')).send(b);
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Login with incorrect password returns false', async () => {
    let res = (await request.post('/login')).send(c);
    res = res.body;
    expect(res.success).toEqual(false);
});

test('JWT returns the user that created the JWT', async () => {
    let res = (await request.post('/jwt')).send(a);
    res = res.body;
    expect(res.user).toEqual('admin');
});

test('Verify returns the validity of the JWT', async () => {
    let res = (await request.post('/verify')).send(a);
    res = res.body;
    expect(res.valid).toEqual(true);
});

test('Signup with a new account return true', async () => {
    //TODO: Make a delete account function to properly implement this test
    let res = (await request.post('/signup')).send(d);
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Signup with existing account returns false', async () => {
    let res = (await request.post('/signup')).send(a);
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Posting task to existing user returns true', async () => {
    //TODO: Make a special post that allows us to specify the task so we can delete it after the test
    let res = (await request.post('/task')).send(a);
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Posting task to non-existent user returns false', async () => {
    let res = (await request.post('/task')).send(b);
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Deleting a task returns true', async () => {
    let res = (await request.post('/delete')).send(a);
    res = res.body;
    expect(res.success).toEqual(true);
});

test('Deleting an non-existent task returns false', async () => {
    let res = (await request.post('/delete')).send(b);
    res = res.body;
    expect(res.success).toEqual(false);
});

test('Usertask returns all tasks from a user', async () => {
    let res = (await request.post('/usertask')).send(a);
    res = res.body;
    expect(res.success).toEqual(true);
});