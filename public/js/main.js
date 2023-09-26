const deleteBtn = document.querySelectorAll('.fa-trash') //creating a constant variable and assigning it to a selection of all elements with a class of '.fa-trash', the trashcan. 
const item = document.querySelectorAll('.item span') //creating a constant variable and assigning it to a selection of all span elements with a parent with the class of '.item'.
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a constant variable and assigning it to a selection of all span elements with the class of '.completed' with a parent with the class of '.item'. 

//Creating an array of the elements assigned to the variable 'deleteBtn' and implementing a loop to run for each element of the array.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and calls a function called 'deleteItem'
}) //close the loop

//Creating an array of the elements assigned to the variable 'item' and implementing a loop to run for each element of the array.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and calls a function called 'markComplete'
}) //close the loop

//Creating an array of the elements assigned to the variable 'itemCompleted' and implementing a loop to run for each element of the array.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //add an event listener to the current item that waits for a click and calls a function called 'markUnComplete'
}) //close the loop

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from result of the deleteItem route
            method: 'delete', //setting CRUD (delete) method for the route
            headers: {'Content-Type': 'application/json'}, //we are specifying the type of content expected, JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closing the catch block
} //end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list
    try{ //starting a try block
        const response = await fetch('markComplete', { //creating a response variable that waits on a fetch to get data from result of the markComplete route
            method: 'put', //setting CRUD (update) method for the route
            headers: {'Content-Type': 'application/json'}, //we are specifying the type of content expected, JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closing the catch block
} //end the function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list
    try{ //starting a try block
        const response = await fetch('markUnComplete', { //creating a response variable that waits on a fetch to get data from result of the markUnComplete route
            method: 'put', //setting CRUD (update) method for the route
            headers: {'Content-Type': 'application/json'}, //we are specifying the type of content expected, JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closing the catch block
} //end the function