const mysql = require('mysql2')
const crypto = require('crypto')
const base64url = require('base64url')


module.exports =
{

    createConnection : function ()
    {
        // return a connection object that can be used for making database queries
        let conn = mysql.createConnection(
            {
                host: 'localhost',
                user: 'admin',
                password: 'password',
                database: 'test',
                insecureAuth: true
            }
        );
        conn.connect((err) => {
            if(err) throw err;
        })
        return conn;
    },

    hash : function (pw, salt)
    {
        let s = pw + '' + salt;
        let h = crypto.createHash('sha256').update(s).digest('hex');
        return h;
    },

    generateSalt : function ()
    {
        let b = crypto.randomBytes(4);
        let r = b.readInt32BE();
        return r;
    },

    createJWT : function (user, ip)
    {
        let jwt;
        let header = 
        {
            "alg": "HS256",
            "typ": "JWT"
        }
        let headEnc = base64url(JSON.stringify(header));

        let now = Date.now();
        // TODO: change this time to give something like 30 minutes once done with testing
        let exp = now + (30 * 24 * 60 * 60 * 1000);
        let body = 
        {
            "iss": "Jal Home",
            "iat": now,
            "exp": exp,
            "user": user,
            "ip" : ip
        }
        let bodyEnc = base64url(JSON.stringify(body));

        let signature = crypto.createHmac('sha256', 'secretkey').update(headEnc + '.' + bodyEnc).digest('base64');

        jwt = headEnc + '.' + bodyEnc + '.' + signature;
        return jwt;
    },

    isJWTValid : function (JWT, ip)
    {
        let split = JWT.split('.');
        let ver = split[0] + '.' + split[1];
        let VerHmac = crypto.createHmac('sha256', 'secretkey').update(ver).digest('base64')
        if(split[2] === VerHmac)
        {
            let body = base64url.decode(split[1]);
            body = JSON.parse(body);
            let ret = this.isJWTNotExpired(body.exp);
            if(ip !== body.ip)
            {
                ret = false;
            }
            return ret;
        }
        return false;
    },

    isJWTNotExpired : function (time)
    {
        let now = Date.now();
        if(time > now)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    getJWTUser : function (jwt)
    {
        body = this.getJWTBody(jwt);
        user = body.user;
        return user;
    },

    getJWTBody : function (jwt)
    {
        let split = jwt.split('.');
        let body = base64url.decode(split[1]);
        body = JSON.parse(body);
        return body;
    }

};