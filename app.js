const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express() 

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

var pgp = require('pg-promise')();
var connectionString = 'postgres://localhost:5432/blogdb';
var db = pgp(connectionString);

app.post('/add-post',(req,res) => {

    let title = req.body.title 
    let body = req.body.description 
    
    db.none('INSERT INTO blogPosts(postTitle,postBody) VALUES($1,$2)',[title,body]).then(() => {
        res.redirect('/')  
    })
})

app.get('/edit-post', (req,res) => {
    res.render('edit-post')
})

app.post('/edit-post',(req,res) => {
    let postID = req.body.postid
    let title = req.body.title 
    let body = req.body.description   
    db.none('UPDATE blogPosts SET postTitle = $2, postBody = $3 WHERE postid = $1;',[postID,title,body]).then(() => {
        res.redirect('/')  
    })
})

app.post('/delete-post', (req,res) => {
    let postID = req.body.postID
    db.none('delete from blogPosts where postID = $1', [postID]).then(() => {
        res.redirect('/')
    })
})  

app.get('/delete-post', (req,res) => {
    res.render('delete-post')
})

app.get('/add-post',(req,res) => {
    res.render('add-post')
})

app.get('/',async (req,res) => {

    let posts = await db.any('SELECT postID, postTitle, postBody, datecreated FROM blogPosts ORDER BY postID DESC;')
    //console.log(posts)
    res.render('index',{posts: posts})
})

app.listen(3000,() => { console.log('Server is running...')})