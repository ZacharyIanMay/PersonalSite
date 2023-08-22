const express = require('express')
const util = require('./utils.js')
const app = express()
const PORT = 3000
const mysql = require('mysql')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})

app.post('/login', (req, res) => {
    let user = req.body.username;
    let pwHash = req.body.hash;
    // Create connection
    let conn = util.createConnection();
    // Form query
    conn.query('select pwHash from users where username = ?', user, (error, results, fields) => 
    {
        
        if(error || results.length === 0)
        {
            let ret = {
                success: 0,
                error: "Incorrect Username or Password"
            }
            res.send(ret);
        }

        let verificationHash = results[0].pwHash;
        console.log(pwHash);
        console.log(verificationHash);
        if(pwHash === verificationHash)
        {
            let ret = {
                success: 1,
                username: user
            }
            res.send(ret)
        }
        else
        {
            let ret = {
                success: 0,
                username: user
            }
            res.send(ret);
        }
    });
    conn.end();
})

app.get('/salt', (req, res) => {
    let ret = {
        success: 1,
        salt: util.generateSalt()
    }
    res.send(ret);
})

app.post('/salt', (req, res) => {
    let user = req.body.username;
    let query = 'failed';
    let conn = util.createConnection();
    conn.query('select salt from users where username = ?', user, (error, results, fields) => {
        if(error) 
        {
            let ret = {
                success: 0,
                username: user,
                err: error
            }
            res.send(ret);
        }
        query = results[0].salt;
        console.log(fields);
        let ret = {
            success: 1,
            username: user,
            salt: query
        }
        res.send(ret)
    });
    conn.end();
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

app.post('/signup', (req, res) => {
    let user = req.body.username;
    let pwHash = req.body.hash;
    let salt = req.body.salt;
    /**
     * Need to add a segment handling password hash retrieval
     */
    // Create connection
    let conn = util.createConnection();
    let err;
    conn.query('select pwHash from users where username = ?', [user], (error, results, fields) => {
        if(error) err = error;
    });
    if(!err)
    {
        let suc = false;
        conn.query('insert into users value (?, ?, ?)', [user, pwHash, salt], (error, results, fields) => {
            if(!error)
            {
                let ret = {
                    success: true,
                    username: user,
                    salt: salt
                }
                res.send(ret);
            }
            else
            {
                let ret = {
                    success: false,
                    error: {code: error.code, errno: error.errno}
                }
                res.send(ret);
            }
        });
        conn.end();
    }
    else
    {
        let ret = {
            success: 0,
            error: err
        }
        res.send(ret);
    }
})

app.post('/task', (req, res) => {
    let user = req.body.username;
    let task = req.body.task;
    // deadline needs to be in yyyy-mm-dd hh:mm:ss
    // TODO: add handling to enforce this format
    let deadline = req.body.deadline;
    // Create connection
    let conn = util.createConnection();
    // Form query
    let suc = false;
    conn.query('insert into tasks (username, task, deadline) value (?, ?, ?)', [user, task, deadline], (error, results, fields) => {
        if(!error)
        {
            let ret = {
                success: true,
                username: user,
                task: task,
                deadline: deadline
            }
            res.send(ret);
        }
        else
        {
            console.log(error);
            let ret = {
                success: false,
                error: {code: error.code, errno: error.errno}
            }
            res.send(ret);
        }
    });
    conn.end();
})

/**
 * gets all the tasks for a specific user
 */
app.get('/task', (req, res) => {
    let user = req.body.username;

    let conn = util.createConnection();
    // Form query
    conn.query('select * from tasks where username = ?', user, (error, results, fields) => 
    {
        let ret = {
                success: 0,
                username: user
            }
        if(error)
        {
            ret.error = error;
            res.send(ret);
        }
        else if(results.length === 0)
        {
            ret.error = "No tasks";
            res.send(ret);
        }

        ret.tasks = results;
        ret.success = 1;
        res.send(ret);
    });

    conn.end();
})

app.delete('/task', (req, res) => {
    let user = req.body.username;
    let id = req.body.taskid;

    let conn = util.createConnection();
    // Form query
    conn.query('delete from tasks where username = ? and taskid = ?', [user, id], (error, results, fields) => 
    {
        let ret = {
            success: 0,
            username: user,
            taskid: id
        }

        if(error)
        {
            ret.error = error;
            res.send(ret);
        }

        ret.success = 1;
        res.send(ret);
    });
    conn.end();
})

app.post('/project', (req, res) => {

})

app.get('/project', (req, res) => {
    // return array of projects
})

app.delete('/project', (req, res) => {
    
})