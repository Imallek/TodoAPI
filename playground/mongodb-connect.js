//Object destructuring the the way for ES-6 to pull out the variables from an object
//Below is the commented out example

/*
    let user = {name: 'Adeel' , age: 25, location:'Lahore'};

    //we want to make a variable named 'age' and assign it above user's age
    // Ofcourse we can do   let age = user.age;
    //Below is the ES6 way of doing the same thing

    let {age} = user; //Simple as that, we get a variable age that has the same value as user's age
 */
//---------------------------------------------------------
//First of all we have to get a handler on the database
//MongoClient in the library "mongodb" is used to do things like (connecting to the database)

//const MongoClient = require('mongodb').MongoClient;

//Using destructuring to get the value, same as above
const {MongoClient, ObjectID} = require('mongodb');

//Using custom ObjectID
// All documents are by default assigned this id in the attribute _id
//This is just to elaborate that we can use the ObjectId anywhere we want
// let obj = new ObjectID();

// Now connect to the database with MongoClient
// Two argument are passed, first one is the location of the database(could be local,aws,heroku etc)
// the second argument is the callback function having args (error, db)

//Callback's args are like that program that we made earlier
//in which either db or error is passed at a time and the parameter that is not passed would be undefined

let toAvoidDeprecatedWarning = { useNewUrlParser: true };
MongoClient.connect('mongodb://localhost:27017', toAvoidDeprecatedWarning , (error,client)=>{

    //first check, if the error argument is passed ? then connection failed ofcourse
    if(error){
        console.log('unable to connect to database');
        return; //just return because connection failed
    }

    console.log('Connection to database is established');

    // To use a collection, you've to specify the name of the collection
    // There is no need to create it just specify the name for using it
    // the second argument is the callback function "insertOne"
    // "insertOne" takes the document to insert and the result callback function

    const databaseName = `TodoApp`;
    const db = client.db(databaseName);
    //Note that the database we have mentioned above, WE HAVE NOT created that
    // in MongoDB you can just connect to the database without creating it
    // We may be connected to the database but in actual it wont be made(by mongo) unless we do some operations no it

    db.collection('Todos').insertOne({
        text: 'Something needs to be done',
        completed: false
    }, (error, result)=>{
        if(error){
            console.log(`Unable to insert the document ${error}`);
            return;
        }

        // In case of success
        // Print the docs that we have just inserted
        // Inserted Docs would be present in the "ops" os the results that is passed in callback
        console.log(JSON.stringify(result.ops, undefined, 2));
    });


    //Adding Users collection and a record
    db.collection('Users').insertOne({
        name : 'Adeel',
        age : 25,
        location : 'Lahore'
        // _id : 123456    //Commented for getting timeStamp purpose
        //We are inserting only 3 things here
        //BUT in every document in the collection 1 property "__id" (that is the object ID) will automatically be inserted
        //ObjectId(_id) is non-incremented and is the unique identifier for the document
        //ObjectId is the idea to scale-out the database easily

        //ObjectID is 12 Byte value with the
            // first 4 Byte as time stamp
            // next 3 Bytes are for machine identifier(means if 2 docs are created at the same time in 2 machines, still they would be different)
            // next 2 bytes in the process-id
            //Last 3 bytes are the random value given by mongoDB to a document
        //

        //Column _id has the default value of ObjectID as explained above
        //We can overwrite that if we want, If we don't overwrite the default will be given
        //Above I am overwritten the _id property and gave it a custom value, that just fine
    }, (error, results)=>{
        if(error){
            console.log('Insert in the User collection failed', error);
            return;
        }

        //result.ops contain array of all the elements are inserted
        //We can see all the items individually
        //above we are only inserting one thing, so we can see elements individually
        console.log(JSON.stringify(results.ops[0]._id.getTimestamp(), undefined, 2));
    });

    //Database Rule101 : Never forget closing the connection when done
    client.close();

});