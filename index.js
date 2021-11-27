const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6iub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('tourService');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');


        //GET api for this project
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/addservice', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/manageallorders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        //Final Route for myorder
        app.get('/myorders/:email', async (req, res) => {
            const cursor = ordersCollection.find({ email: req.params.email });
            const orders = await cursor.toArray();
            res.send(orders);
        });





        // GET Single Service
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



        // POST API
        app.post('/addservice', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // POST API
        app.post('/booking', async (req, res) => {
            const order = req.body;


            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });





        // DELETE API
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Travel Server');
});

app.get('/hello', (req, res) => {
    res.send('hello update here');
});

app.listen(port, () => {
    console.log('Travel Server on port', port);
})