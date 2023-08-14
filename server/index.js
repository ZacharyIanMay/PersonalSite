const express = require('express')
const util = require('./utils.js')
const app = express()
const PORT = 3000

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
    // Form query
    // Send Query
    // Check that there are results
    // If multiple results, there is something wrong
    // store the password hash for verification
    let verificationHash = "abcd";
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
})

app.post('/signup', (req, res) => {
    let user = req.body.username;
    let pwHash = req.body.hash;
    /**
     * Need to add a segment handling password hash retrieval
     */
    // Create connection
    // Form query for any existing usernames
    // Send Query
    // Check that there are results
    // If there are results, return an error via err stating such
    let err;
    if(!err)
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