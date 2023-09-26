const express = require('express')
const util = require('./utils.js')
const cors = require('cors')
const app = express()
const PORT = 3000
const mysql = require('mysql')

app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
    let jwt = util.createJWT('test', req.ip);
    setTimeout(function() {
        let result = util.isJWTValid(jwt);
        let user = '';

        user = util.getJWTUser(jwt);

        res.send({"jwt": jwt, "user": user, "result": result});
    }, 1000)
    
})

module.exports = app;
// app.listen(PORT, () => {
//     // console.log(`App is listening at http://localhost:${PORT}`)
// })

/**
 * Checks user credentials and issues a JWT login token if login is correct
 * req requires fields username and password
 * res contains fields success and username
 * if failed res additionally contains error
 * if succesful res additionally contains token
 */
app.post('/login', async (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let conn = util.createConnection();
    conn.query('select salt, pwHash from users where username = ?', [user], (error, results, fields) => 
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
                let jwt = util.createJWT(user, req.ip);
                ret.success = true;
                ret.token = jwt;
            }
            else
            {
                ret.error = "Incorrect Username or Password"
            }
            res.send(ret);
        }
        else
        {
            ret.error =  "Incorrect Username or Password";
            res.send(ret);
        }
    });
    conn.end();
})

/**
 * 
 */
app.post('/jwt', async (req, res) => {
    let jwt = req.body.jwt;
    let body = util.getJWTBody(jwt);
    let ret =
    {
        user: body.user,
        ip: body.ip
    }
    res.send(ret);
})

/**
 * 
 */
app.post('/verify', async (req, res) => {
    let jwt = req.body.jwt;
    let ret = {};
    ret.valid = util.isJWTValid(jwt, req.ip);
    res.send(ret);
})

// app.post('/test', (req, res) => {
//     let salt = req.body.salt;
//     let pass = req.body.password;
//     let hash = util.hash(pass, salt);
//     console.log(hash);
//     let ret = {
//         hash: hash
//     }
//     res.send(ret);
// })

/**
 * creates a user account
 * req requires fields username and password
 * res contains fields success and username
 * additionally, error if failed, or token is successful
 */
app.post('/signup', async (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let salt = util.generateSalt();
    let pwHash = util.hash(pass, salt);
    /**
     * Need to add a segment handling password hash retrieval
     */
    // Create connection
    let conn = util.createConnection();
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
                let jwt = util.createJWT(user, req.ip);
                ret.success = true;
                ret.token = jwt;
            }
            else
            {
                ret.error = {code: error.code, errno: error.errno};
            }
            res.send(ret);
        });
        conn.end();
    }
    else
    {
        ret.error = err;
        res.send(ret);
    }
})

/**
 * Adds a task to a given user
 * req requires fields username, task, deadline
 * res contains fields success, username
 * additionally error if failed
 */
app.post('/task', async (req, res) => {
    let user = req.body.username;
    let task = req.body.task;
    // deadline needs to be in yyyy-mm-dd hh:mm:ss
    // TODO: add handling to enforce this format
    let deadline = req.body.deadline;
    // Create connection
    let conn = util.createConnection();
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
        res.send(ret);
    });
    conn.end();
})

app.post('/taskS', async (req, res) => {
    let user = req.body.username;
    let task = req.body.task;
    let id = req.body.taskid
    // deadline needs to be in yyyy-mm-dd hh:mm:ss
    // TODO: add handling to enforce this format
    let deadline = req.body.deadline;
    // Create connection
    let conn = util.createConnection();
    // Form query
    conn.query('insert into tasks (taskid, username, task, deadline) value (?, ?, ?, ?)', [id, user, task, deadline], (error, results, fields) => {
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
})

/**
 * 
 */
app.post('/delete', async (req, res) => {
    let user = req.body.username;
    let taskid = req.body.taskid;
    // Create connection
    let conn = util.createConnection();
    let err;
    
    let ret = {
        success: false,
        username: user
    }

    conn.query('select * from tasks where username = ? and taskid = ?', [user, taskid], (error, results, fields) => {
        if(results.length === 0)
        {
            err = "No such task";
            ret.error = err;
            res.send(ret);
        }
    });
    // Form query
    if(err)
    {
        conn.query('delete from tasks where username = ? and taskid = ?', [user, taskid], (error, results, fields) => {
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
    }
    conn.end();
})

/**
 * gets all the tasks for a given username
 * req requires fields username
 * res contains fields success and username
 * additionally if failed res contains field error
 * if succesful res contains field tasks
 */
app.post('/usertask', async (req, res) => {
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
        res.send(ret);
    });

    conn.end();
})

// /**
//  * gets all the tasks
//  * req requires fields username
//  * res contains fields success
//  * additionally if failed res contains field error
//  * if succesful res contains field tasks
//  */
// app.post('/task', async (req, res) => {
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