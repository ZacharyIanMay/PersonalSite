const index = require('./index');
const util = require('./utils.js');
const req = 
{
	"username": "test",
	"password": "test",
	"task": "This is a sample task",
	"deadline": "2000-01-01 00:00:01",
	"taskid": 1,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};
const badReq = 
{
	"username": "test",
	"password": "tester",
	"task": "This is a sample task",
	"deadline": "2000-01-01 00:00:01",
	"taskid": 1,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};
const fail = 
{
	"username": "tester",
	"password": "tester",
	"task": "This is a sample task",
	"deadline": "2000-01-01 00:00:01",
	"taskid": 999999999,
	"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E="
};

test('Signup using existing username should fail', async () => {
    let user = fail.username;
    let pass = fail.password;
    let conn = util.createConnection();
    let res = index.postSignup(user, pass, conn);
    conn.end();
    expect(res.success).toBe(false);
});

test('Signup using new username should succede', async () => {
    let user = req.username;
    let pass = req.password;
    let conn = util.createConnection();
    let res = index.postSignup(user, pass, conn);
    conn.end();
    expect(res.success).toBe(true);
});

test('Login attempt with valid credentials should succeed', async () => {
    let user = req.username;
    let pass = req.password;
    let conn = util.createConnection();
    let res = index.postLogin(user, pass, conn);
    conn.end();
    expect(res.success).toBe(true);
});

test('Login attempt with incorrect password should fail', async () => {
    let user = badReq.username;
    let pass = badReq.password;
    let conn = util.createConnection();
    let res = index.postLogin(user, pass, conn);
    conn.end();
    expect(res.success).toBe(false);
});

test('Login attempt with incorrect username should fail', async () => {
    let user = fail.username;
    let pass = fail.password;
    let conn = util.createConnection();
    let res = index.postLogin(user, pass, conn);
    conn.end();
    expect(res.success).toBe(false);
});

test('JWT should return the same username as was used to create it', async () => {
    let res = index.postJWT(req.jwt);
    expect(res.user).toBe('admin');
});

test('Created JWT should be valid after creation', async () => {
    let user = req.username;
    let pass = req.password;
    let conn = util.createConnection();
    let res = index.postLogin(user, pass, conn);
    let ver = index.postVerify({jwt: res.token});
    conn.end();
    expect(ver.valid).toBe(true);
});

test('posting a task for a valid user should succede', async () => {
    let user = req.username;
    let task = req.task;
    let taskid = req.taskid;
    let deadline = req.deadline;
    let conn = util.createConnection();
    try
    {
        // make sure the task doesn't already exist
        index.postDelete(user, taskid, conn);
    }catch(error)
    {
        // do nothing
    }
    let res = index.postTaskS(user, task, taskid, deadline, conn);
    conn.end();
    expect(res.success).toBe(true);
});

test('Posting a task for an invalid user should fail', async () => {
    let user = fail.username;
    let task = fail.task;
    let taskid = fail.tasks;
    let deadline = fail.deadline;
    let conn = util.createConnection();
    let res = index.postTaskS(user, task, taskid, deadline, conn);
    conn.end();
    expect(res.success).toBe(false);
});

test('Deleting an existing task should succede', async () => {
    let user = req.username;
    let task = req.task;
    let taskid = req.tasks;
    let deadline = req.deadline;
    let conn = util.createConnection();
    try
    {
        index.postTaskS(user, task, taskid, deadline, conn);
    }catch(error)
    {
        // do nothing
    }
    let res = index.postDelete(user, taskid, conn);
    conn.end();
    expect(res.success).toBe(true);
});

test('Deleting a nonexistent task should fail', async () => {
    let user = fail.username;
    let taskid = fail.tasks;
    let conn = util.createConnection();
    let res = index.postDelete(user, taskid, conn);
    conn.end();
    expect(res.success).toBe(true);
});

test('Usertask should return all tasks for a user', async () => {
    let user = req.username;
    let conn = util.createConnection();
    let res = postUsertask(user, conn);
    conn.end();
    expect(res.success).toBe(true);
});