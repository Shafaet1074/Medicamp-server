const express = require('express');
require('dotenv').config()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app=express();
const port=process.env.PORT || 5005; 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ftvpmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const CampCollections =client.db('MediCamp').collection('Camps')
    const OrganizerCollections =client.db('MediCamp').collection('organizers')
    const userCollections =client.db('MediCamp').collection('users')
    const cartCollection = client.db("MediCamp").collection("carts");


   

  //  jwt related API

   app.post('/jwt' , async(req,res)=>{
    const user =req.body;
    const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn: '1h'});
    res.send({ token });
   })
  

   const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'unauthorized' });
      }
      req.user = decoded;
      next();
    });
  };

  // use verify admin after verifyToken
  const verifyAdmin= async(req,res,next) =>{
    const email=req.user.email;
    const query ={email:email};
    const user =await userCollections.findOne(query);
    const isAdmin =user?.role === 'admin';
    if(!isAdmin){
      return res.status(403).send({message:'forbiden access'});
    }
    next();
  }

  






   //users related API


   app.post('/users', async(req,res) =>{
      const user =req.body;
      const query ={email: user.email}
      const existingUser= await userCollections.findOne(query);
   
      if(existingUser){
        return res.send({message:'user already exists',insertedId: null})
      }
      const result = await userCollections.insertOne(user);
      res.send(result);
   })
   app.get('/users',verifyToken,verifyAdmin,async(req,res)=>{
    const result=await userCollections.find().toArray();
    res.send(result)
  })

  app.get('/users/admin/:email', verifyToken,async(req,res)=>{
     const email= req.params.email;
     if(email !== req.user.email){
      return res.status(403).send({message:'forbidden access'})
     }
     const query={email:email};
     const user = await userCollections.findOne(query);
     let admin = false;
     if(user){
       admin = user?.role === 'admin';
     }
    res.send({admin});
  })


   app.patch('/users/admin/:id',verifyToken, verifyAdmin, async(req,res)=>{
    const id =req.params.id;
    const filter ={_id:new ObjectId(id)};
    const updatedDoc={
      $set:{
        role:'admin'
      }
    }
    const result = await  userCollections.updateOne(filter,updatedDoc)
    res.send(result);
   })





    //camps related API 
    app.get('/camps', async(req,res)=>{
      const result=await CampCollections.find().toArray();
      res.send(result)
    })

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

   

    app.post('/camps' , verifyToken , verifyAdmin,async(req,res)=>{
      const campItem=req.body;
      const result=await CampCollections.insertOne(campItem)
      res.send(result)
    })

    app.delete('/camps/:id', verifyToken, verifyAdmin, async(req,res) =>{
      const id= req.params.id;
      console.log(id);
      const query={_id: new ObjectId(id)}
      const result = await CampCollections.deleteOne(query);
      res.send(result);
    })

    app.put('/camps/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCamp = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          campname: updatedCamp.campname,
          image: updatedCamp.image,
          campfees: updatedCamp.campfees,
          Location: updatedCamp.Location,
          HealthcareProfessionalName: updatedCamp.HealthcareProfessionalName,
          Participantcount: updatedCamp.Participantcount,
          Description: updatedCamp.Description
        }
      };
      const result = await CampCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post('/create-payment-intent', async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount, 'amount inside the intent')

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
      });

      res.send({
        clientSecret: paymentIntent.client_secret
      })
    });




  //organizers related API

    app.get('/organizers', async(req,res)=>{
      const result=await OrganizerCollections.find().toArray();
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req ,res)=>{
  res.send('medicamp server is running')
})

app.listen(port,()=>{
  console.log(`server is running on ${port}`);
})