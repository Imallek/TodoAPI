const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017';
let ThingtoPreventWarning = {
    useNewUrlParser : true
};

MongoClient.connect(url, ThingtoPreventWarning, (error, client)=>{
    if(error){
        console.log('Unable to connect with the database');
        return;
    }
    console.log('Connection successful');

    const databaseName = 'TodoApp';
    let db = client.db(databaseName);

    //if we don't provide any argument in the find() then a cursor to 'Todos' is returned
    //db.collection('Todos').find();   // This will return the cursor to the Todos
    //We can use many methods on the cursor to get the results !

    // We want to get all the items in the Todos in array form, We can use .toArray method on the cursor
    // To array returns a promise so we can put a "then" on it
    // toArray returns a promise (remember first function in then is for success case, Second function is for failure case)
    // if we leave the find empty OR pass empty object in it, it will return everything in the collection
    // find requires a query, i-e the data to filter from the collection
    // let say we pass that return everything with completion property true
    db.collection('Todos').find({completed: true}).toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    },(error)=>{
        console.log(`Unable to fetch todos ${error}`);
    });


    //There are many other methods that we can call on the cursor
    // See the docs API to get the hold of that
    // count returns Promise if no callback passed, so we can use .then like we used above !
    db.collection('Todos').find({completed: false}).count(false,{},(error, count)=>{
        if(error){
            console.log('Error occurred', error);
            return;
        }

        console.log(`Number of documents in the result of above query in find are ${count}`);
    });


    //client.close()
});