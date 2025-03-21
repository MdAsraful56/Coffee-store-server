const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send('Coffee Store is Running......')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hvhc0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffee');
        const userCollection = client.db('coffeeDB').collection('users')
        // add new post / new coffee 
        app.post('/coffee', async(req, res) => {
            const newCoffee = req.body;
            // console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });

        // coffee data get 
        app.get('/coffee', async(req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // delete coffee 
        app.delete('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })

        //daynamik id a coffee
        app.get('/updatecoffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query)
            res.send(result);
        })

        //daynamik id a coffee
        app.get('/details/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query)
            res.send(result);
        })

        // update a daynamik id coffee 
        app.put('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true }
            const updatedcoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedcoffee.name,
                    chef: updatedcoffee.chef,
                    supplier: updatedcoffee.supplier,
                    taste: updatedcoffee.taste,
                    category: updatedcoffee.category,
                    details: updatedcoffee.details,
                    photo: updatedcoffee.photo
                }
            }
            const result = await  coffeeCollection.updateOne(filter, coffee,options);
            res.send(result);
        })


        // users related api 

        app.get('/users', async(req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async(req, res) => {
            const newUser = req.body;
            console.log('creating new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        // app.delete('/users/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: new ObjectId(id)}
        //     const result = userCollection.findOne(query);
        //     res.send(result)
        // })


        app.patch('/users', async(req, res) => {
            const email = req.body.email;
            const filter = { email }
            const updateDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`Server is Running on  http://localhost:${port}`)
})