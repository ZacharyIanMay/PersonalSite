const utils = require('./utils');

test('Hash function generates the correct hash given the same password and salt', () =>
{
    expect(utils.hash('password', 'salt')).toEqual('7a37b85c8918eac19a9089c0fa5a2ab4dce3f90528dcdeec108b23ddf3607b99');
});

test('createJWT returns a JWT with a correct difference in expiratory time, and with the correct issuer and user', () =>
{
    let a = utils.createJWT('user');
    let b = utils.getJWTBody(a);
    let comp = 
    {
        "iss" : b.iss,
        "time" : (b.exp - b.iat),
        "user" : b.user
    }
    let exp = 
    {
        "iss" : "Jal Home",
        "time" : (30 * 24 * 60 * 60 * 1000),
        "user" : 'user'
    }
    expect(comp).toEqual(exp);
});

test('getJWTBody to give the same information as was present in the JWT', () =>
{
    let jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E=';
    let body = utils.getJWTBody(jwt);
    let exp =
    {
        "iss" : "Jal Home",
        "iat" : 1694205291048,
        "exp" : 1696797291048,
        "user" : "admin"
    };
    expect(body).toEqual(exp);
});

test('getJWTUser to return the correct user who generated the JWT', () =>
{
    let jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E=';
    let user = utils.getJWTUser(jwt);
    expect(user).toEqual("admin");
});

test('isJWTValid should return true for a newly generated JWT', () => 
{
    let jwt = utils.createJWT("user");
    let valid = utils.isJWTValid(jwt);
    expect(valid).toEqual(true);
});

test('isJWTValid should return false for a modified JWT', () =>
{
    let jwt = utils.createJWT("user");
    jwt = jwt.substring(3);
    let valid = utils.isJWTValid(jwt);
    expect(valid).toEqual(false);
});

test('isJWTNotExpired should return false for an expired JWT', () =>
{
    //This will be incorrect until Oct 8 2023, TODO: generate a JWT that is already expired and replace this one
    let jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJKYWwgSG9tZSIsImlhdCI6MTY5NDIwNTI5MTA0OCwiZXhwIjoxNjk2Nzk3MjkxMDQ4LCJ1c2VyIjoiYWRtaW4ifQ.bRZ2fmaV3/veiYy+ybH1+I6vdSgFXIdkmkWNW93YS3E=';
    let body = utils.getJWTBody(jwt);
    let exp = utils.isJWTNotExpired(body.exp);
    expect(exp).toEqual(false);
});

test('isJWTNotExpired should return true for a non-expired JWT', () => 
{
    let jwt = utils.createJWT("user");
    let body = utils.getJWTBody(jwt);
    let exp = utils.isJWTNotExpired(body.exp);
    expect(exp).toEqual(true);
});

