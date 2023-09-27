const express = require('express') //setting a constant to make it possible to use express in this file
const app = express() //call to express is assigned to a constant called 'app'
const MongoClient = require('mongodb').MongoClient //MongoClient allows us to talk to MongoDB in a way that it understands and perform operations using methods associated with MongoClient.
const PORT = 2121 //setting a constant for the location the server is listening for, PORT
require('dotenv').config() //allow us to look for variables inside of .env file


let db, //declaring a global variable called 'db', not assigning a value.
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assiging the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string and passing in an additional property
    .then(client => { //MongoClient.connect is establishing a promise so we can chain .then and have things happen in sequence, meaning we only want to run these commands if the connection to the database is successful. We are also passing in the client information.
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal 'Connected to todo Database'
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then

//middleware: helps us facilitate communication for our request
app.set('view engine', 'ejs') //sets ejs as the default render method, our templating language
app.use(express.static('public')) //sets the location for static assets
//these two .use below help us do what body parser used to do. Look at the requests coming through and pull the data out of the requests.
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. The extended part supports arrays and objects
app.use(express.json()) //parses JSON content


app.get('/',async (request, response)=>{ //GET method (read), root route, asynchronous function with request, response parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the number of items from the 'todos' collection with the 'completed: false' property/value
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering 'index.ejs and inside of that render method passing in an object that contains our to do items and the items left. 
//this is the classic promise version of the async function above
    // db.collection('todos').find().toArray()
        //db is holding the connection to our database, go to database and find collection of 'todos', find all documents (objects), put into array
        //pass that value (the array holding the 'todos') into the parameter of data
    // .then(data => {
        // db.collection('todos').countDocuments({completed: false})
        // .then(itemsLeft => {
            // response.render('index.ejs', { items: data, left: itemsLeft })
            //pass all of the objects (data) retrieved from the database into the ejs template.
            //the array of objects (data) passing into the ejs template has been given the name items
        // })
    // })
    // .catch(error => console.error(error)) //catching errors
}) // ending the GET async function

app.post('/addTodo', (request, response) => { //POST method (create) triggers when '/addToDo' route is passed in, function with request, response parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item (document/object) into the todos collection. A request coming from client side, getting todoItem from within that body and assigning to the 'thing' property in the document with the 'completed' property of false.
    .then(result => { //classic promis syntax. if insert is successful, do something 
        console.log('Todo Added') //console log action
        response.redirect('/') //redirect back to the root
    }) //closing the .then 
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //PUT method (update) triggers '/markComplete' route, function with request, response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on. Note: if there were multiple tasks with the same name, it will just update the first one. Generally preference would be selecting by ID
        $set: {
            completed: true //set the completed property to 'true'
          }
    },{
        sort: {_id: -1}, //sorts top to bottom, currently will just grab first 'thing' (if there were duplicates)
        upsert: false //insert/update. 'false' prevents insertion if item does not already exist. if set to true and tried to update something that wasn't there, it would create the document
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending PUT

app.put('/markUnComplete', (request, response) => { //PUT method (update), triggers '/markUnComplete' route, function with request, response parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on. Note: if there were multiple tasks with the same name, it will just update the first one. Generally preference would be selecting by ID
        $set: {
            completed: false //set the completed property to 'false'
          }
    },{
        sort: {_id: -1}, // //sorts top to bottom, currently will just grab first 'thing' (if there were duplicates)
        upsert: false //insert/update. 'false' prevents insertion if item does not already exist. if set to true and tried to update something that wasn't there, it would create the document
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending PUT

app.delete('/deleteItem', (request, response) => { //DELETE method, '/deleteItem' route, function with request, response parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on. Note: if there were multiple tasks with the same name, it will just update the first one. Generally preference would be selecting by ID
    .then(result => { //starts a then if update was successful
        console.log('Todo Deleted') //logging successful deletion
        response.json('Todo Deleted') //sending a response back to the sender
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors

}) //ending DELETE

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on-either the port form the .env file or the declared variable
    console.log(`Server running on port ${PORT}`) //console log the running port
}) //closing the .listen method