const mysql = require('mysql')
const crypto = require('crypto')

function createConnection()
{
    // return a connection object that can be used for making database queries
    let conn = mysql.createConnection(
        {
            host: 'localhost',
            user: 'admin',
            password: 'password'
        }
    );
    conn.connect((err) => {
        if(err) throw err;
        console.log("Connected");
    })
    return conn;
}

function hash(pw, salt)
{
    let s = pw + '' + salt;
    let h = crypto.createHash('sha256').update(s).digest('hex');
    return h;
}

/**
 * 
 * @param {*} hash expects the salted hash of users password
 * @param {*} user username to verify salted hash
 * @returns true if password is correct for the user, false otherwise
 */
function verify(hash, user)
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
}

function generateSalt()
{
    return crypto.randomBytes(4).readInt32BE();
}