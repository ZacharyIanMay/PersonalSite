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
    /**
     * Need to add a segment handling password hash retrieval
     */
    // Create connection
    let conn = util.createConnection();
    // Form query
    let query = "failed";
    conn.query('select (hash, salt) from users where username = ?', user, (error, results, fields) => {
        if(error) throw error;
        query = results;
        console.log(fields);
    });
    let verificationHash = results.hash;
    let salt = results.salt;
    if(util.verify(verificationHash, salt))
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
})

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
    conn.query('select hash from users where username = ?', user, (error, results, fields) => {
        if(error) throw error;
        err = results.hash;
        console.log(fields);
    });
    if(!err)
    {
        conn.query('insert into users value (?, ?, ?)', [user, pwHash, salt], (error, results, fields) => {
            if(error)
            {
                throw error;
            }
            console.log(fields);
        })
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
            error: err
        }
        res.send(ret);
    }
})

app.post('/task', (req, res) => {

})

app.get('/task', (req, res) => {

})

app.delete('/task', (req, res) => {

})

app.post('/project', (req, res) => {

})

app.get('/project', (req, res) => {
    // return array of projects
})

app.delete('/project', (req, res) => {
    
})