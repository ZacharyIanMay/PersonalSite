const mysql = require('mysql2')
const crypto = require('crypto')


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
            console.log("Connected");
        })
        return conn;
    },

    hash : function (pw, salt)
    {
        let s = pw + '' + salt;
        let h = crypto.createHash('sha256').update(s).digest('hex');
        return h;
    },

    /**
     * 
     * @param {*} hash expects the salted hash of users password
     * @param {*} user username to verify salted hash
     * @returns true if password is correct for the user, false otherwise
     */
    verify : function (hash, user)
    {
        let conn = createConnection();
        // TODO: get user's hash and salt

        let ver = 'TODO';
        if(hash === ver)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    generateSalt : function ()
    {
        console.log('working');
        let b = crypto.randomBytes(4);
        console.log(b);
        let r = b.readInt32BE();
        console.log(r);
        return r;
    }

};