const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5005; 

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






    //camps related API 
    app.get('/camps', async(req,res)=>{
      const result=await CampCollections.find().toArray();
      res.send(result)
    })
   

    app.post('/camps',async(req,res)=>{
      const campItem=req.body;
      const result=await CampCollections.insertOne(campItem)
      res.send(result)
    })

    app.delete('/camps/:id', async(req,res) =>{
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
          campName: updatedCamp.campName,
          image: updatedCamp.image,
          campFees: updatedCamp.campFees,
          location: updatedCamp.location,
          healthcareProfessional: updatedCamp.healthcareProfessional,
          participantCount: updatedCamp.participantCount,
          description: updatedCamp.description
        }
      };
      const result = await CampCollections.updateOne(filter, updateDoc);
      res.send(result);
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