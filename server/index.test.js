const index = require('./index');
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

test('Signup using existing username should fail', () => {
    let res = index.postSignup(fail, );
    expect(res.success).toBe(false);
});

test('Signup using new username should succede', () => {
    let res = index.postSignup(req, );
    expect(res.success).toBe(true);
});

test('Login attempt with valid credentials should succeed', () => {
    let res = index.postLogin(req, );
    expect(res.success).toBe(true);
});

test('Login attempt with incorrect password should fail', () => {
    let res = index.postLogin(badReq, );
    expect(res.success).toBe(false);
});

test('Login attempt with incorrect username should fail', () => {
    let res = index.postLogin(fail, );
    expect(res.success).toBe(false);
});

test('JWT should return the same username as was used to create it', () => {
    let res = index.postJWT(req, );
    expect(res.user).toBe('admin');
});

test('Created JWT should be valid after creation', () => {
    let res = index.postLogin(req, );
    let ver = index.postVerify({jwt: res.token});
    expect(ver.valid).toBe(true);
});

test('posting a task for a valid user should succede', () => {
    try
    {
        // make sure the task doesn't already exist
        postDelete(req, );
    }catch(error)
    {
        // do nothing
    }
    let res = index.postTaskS(req, );
    expect(res.success).toBe(true);
});

test('Posting a task for an invalid user should fail', () => {
    let res = index.postTaskS(fail, );
    expect(res.success).toBe(true);
});

test('Deleting an existing task should succede', () => {
    let res = index.postDelete(req, );
    try
    {
        postTaskS(req, );
    }catch(error)
    {
        // do nothing
    }
    expect(res.success).toBe(true);
});

test('Deleting a nonexistent task should fail', () => {
    let res = index.postDelete(fail, );
    expect(res.success).toBe(true);
});

test('Usertask should return all tasks for a user', () => {
    let res = index.postUsertask(req, );
    expect(res.success).toBe(true);
});