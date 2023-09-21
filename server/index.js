const express = require('express')
const util = require('./utils.js')
const cors = require('cors')
const app = express()
const PORT = 3000
const mysql = require('mysql')

app.use(express.json())
app.use(cors())




/**
 * Functions
 */
module.exports
{

    function getBase(req, res)
    {
        let jwt = util.createJWT('test');
        setTimeout(function() {
            let result = util.isJWTValid(jwt);
            let user = '';

            util.getJWTUser(jwt);

            res.send({"JWT": jwt, "User": user, "Result": result});
        }, 1000)
    }

    function postJWT(jwt)
    {
        let user = util.getJWTUser(jwt);
        let ret =
        {
            user: user
        }
        return ret;
    }

    function postLogin(user, pass, conn)
    {
        conn.query('select salt, pwHash from users where username = ?', user, (error, results, fields) => 
        {
            let ret = {
                success: false,
                username: user
            }
            if(!error && results.length === 1)
            {
                let salt = results[0].salt;
                let pwHash = util.hash(pass, salt);
                let verificationHash = results[0].pwHash;
                if(pwHash === verificationHash)
                {
                    let jwt = util.createJWT(user);
                    ret.success = true;
                    ret.token = jwt;
                }
                else
                {
                    ret.error = "Incorrect Username or Password"
                }
                return ret;
            }
            else
            {
                console.log(error);
                ret.error =  "Incorrect Username or Password";
                return ret;
            }
        });
    }

    function postVerify(jwt)
    {
        let ret = {};
        ret.valid = util.isJWTValid(jwt);
        return ret;
    }

    function postSignup(user, pass, conn)
    {
        let salt = util.generateSalt();
        let pwHash = util.hash(pass, salt);
        /**
         * Need to add a segment handling password hash retrieval
         */
        // Create connection
        let err;
        conn.query('select pwHash from users where username = ?', [user], (error, results, fields) => {
            if(error) err = error;
        });

        let ret = {
            success: false,
            username: user
        };

        if(!err)
        {
            conn.query('insert into users value (?, ?, ?)', [user, pwHash, salt], (error, results, fields) => {
                if(!error)
                {
                    let jwt = util.createJWT(user);
                    ret.success = true;
                    ret.token = jwt;
                }
                else
                {
                    ret.error = {code: error.code, errno: error.errno};
                }
                return ret;
            });
        }
        else
        {
            ret.error = err;
            return ret;
        }
    }

    function postTask(user, task, deadline, conn)
    {
        // deadline needs to be in yyyy-mm-dd hh:mm:ss
        // TODO: add handling to enforce this format
        // Create connection
        // Form query
        conn.query('insert into tasks (username, task, deadline) value (?, ?, ?)', [user, task, deadline], (error, results, fields) => {
            let ret = {
                success: false,
                username: user
            }
            if(!error)
            {
                ret.success = true;
            }
            else
            {
                ret.error = {code: error.code, errno: error.errno};
            }
            return ret;
        });
    }

    function postTaskS(req, res)
    {
        let user = req.body.username;
        let task = req.body.task;
        let taskid = req.body.tasks
        // deadline needs to be in yyyy-mm-dd hh:mm:ss
        // TODO: add handling to enforce this format
        let deadline = req.body.deadline;
        // Create connection
        let conn = util.createConnection();
        // Form query
        conn.query('insert into tasks value ?, ?, ?, ?', [taskid, user, task, deadline], (error, results, fields) => {
            let ret = {
                success: false,
                username: user
            }
            if(!error)
            {
                ret.success = true;
            }
            else
            {
                ret.error = {code: error.code, errno: error.errno};
            }
            res.send(ret);
        });
        conn.end();
    }

    function postDelete(user, taskid, conn)
    {
        // Create connection
        console.log(`delete from tasks where username = ${user} and taskid = ${taskid}`);
        // Form query
        conn.query('delete from tasks where username = ? and taskid = ?', [user, taskid], (error, results, fields) => {
            let ret = {
                success: false,
                username: user
            }
            if(!error)
            {
                ret.success = true;
            }
            else
            {
                ret.error = {code: error.code, errno: error.errno};
            }
            return ret;
        });
    }

    function postUsertask(user, conn)
    {
        let user = req.body.username;
        let conn = util.createConnection();
        // Form query
        conn.query('select * from tasks where username = ?', user, (error, results, fields) => 
        {
            let ret = {
                success: false,
                username: user
            }
            if(error)
            {
                ret.error = error;
            }
            else if(results.length === 0)
            {
                ret.error = "No tasks";
            }
            else
            {
                ret.tasks = results;
                ret.success = true;
            }
            return ret;
        });
    }

}

/**
 * Endpoints
 */

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    getBase(req, res)
})

/**
 * Checks user credentials and issues a JWT login token if login is correct
 * req requires fields username and password
 * res contains fields success and username
 * if failed res additionally contains error
 * if succesful res additionally contains token
 */
app.post('/login', (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let conn = util.createConnection();
    let ret = postLogin(user, pass, conn);
    conn.end();
    res.send(ret);
})

/**
 * 
 */
app.post('/jwt', (req, res) => {
    let jwt = req.body.jwt;
    let ret = postJWT(jwt)
    res.send(ret);
})

/**
 * 
 */
app.post('/verify', (req, res) => {
    let jwt = req.body.jwt;
    let ret = postVerify(jwt);
    res.send(ret);
})

/**
 * creates a user account
 * req requires fields username and password
 * res contains fields success and username
 * additionally, error if failed, or token is successful
 */
app.post('/signup', (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let conn = util.createConnection();
    let ret = postSignup(user, pass, conn);
    conn.end();
    res.send(ret);
})

/**
 * Adds a task to a given user
 * req requires fields username, task, deadline
 * res contains fields success, username
 * additionally error if failed
 */
app.post('/task', (req, res) => {
    let user = req.body.username;
    let task = req.body.task;
    let deadline = req.body.deadline;
    let conn = util.createConnection();
    let ret = postTask(user, task, deadline, conn);
    conn.end();
    res.send(ret);
})

/**
 * 
 */
app.post('/delete', (req, res) => {
    let user = req.body.username;
    let taskid = req.body.taskid;
    let conn = util.createConnection();
    let ret = postDelete(user, taskid, conn);
    conn.end();
    res.send(ret);
})

/**
 * gets all the tasks for a given username
 * req requires fields username
 * res contains fields success and username
 * additionally if failed res contains field error
 * if succesful res contains field tasks
 */
app.post('/usertask', (req, res) => {
    let user = req.body.username;
    let conn = util.createConnection();
    let ret = postUsertask(user, conn);
    conn.end();
    res.send(ret);
})

/**
 * gets all the tasks
 * req requires fields username
 * res contains fields success
 * additionally if failed res contains field error
 * if succesful res contains field tasks
 */
// app.post('/task', (req, res) => {
//     let user = req.body.username;

//     let conn = util.createConnection();
//     // Form query
//     conn.query('select * from tasks', user, (error, results, fields) => 
//     {
//         let ret = {
//             success: false
//         }
//         if(error)
//         {
//             ret.error = error;
//         }
//         else if(results.length === 0)
//         {
//             ret.error = "No tasks";
//         }
//         else
//         {
//             ret.tasks = results;
//             ret.success = true;
//         }
//         res.send(ret);
//     });

//     conn.end();
// })

// app.post('/project', (req, res) => {

// })

// app.get('/project', (req, res) => {
//     // return array of projects
// })

// app.delete('/project', (req, res) => {
    
// })