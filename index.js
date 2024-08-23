const express=require('express')
const app=express()
var bodyParser = require('body-parser')
// var jsonParser = bodyParser.urlencoded({extended: false})
var jsonParser = bodyParser.json()
const { MongoClient } = require("mongodb");
const client = new MongoClient('mongodb://0.0.0.0:27017')
app.listen(3000,()=>{
    console.log('server running at 3000')
})
app.use(express.static(__dirname+"/public/image"));
app.use(express.static(__dirname+"/public/css"));
app.set('view engine','ejs')
app.get('',(req,res)=>{
    res.render('login')   
})
app.get('/home',(req,res)=>{
    res.render('home')   
})
app.get('/login',(req,res)=>{
    res.render('login')   
})
// app.post('/save',jsonParser,(req,res)=>{
//     // res.send(req.body)
//     // console.log(req.body)
//     let {email,password} = req.body
//     if(email=='shivanshpareek3@gmail.com' && password == 1234567890)
//         {
//             res.render('show',{'email':email,'password':password})
//         }
//     else
//         {
//             res.send('<script> alert("Invalid email and password"); location="/login"; </script>')
//         }
// })
app.post('/save',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty")

    mycol.insertOne(req.body).then((result)=>{
        // res.send('<script> alert("Data Inserted...!"); location="/showData"; </script>')
        res.json(result);
    })
})
app.get('/showData',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty")

    let data = await mycol.find().toArray()
    // res.render('showData',{'loginData':data})
    res.json(data);
})
var ObjectId = require('mongodb').ObjectId;
app.get('/detail/:id',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty");
    mycol.findOne({_id:new ObjectId (req.params.id)})
    .then((result)=>{
        res.send(result);
    })
})
app.get('/Edit/:id',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty");
    mycol.findOne({_id:new ObjectId (req.params.id)})
    .then((result)=>{
        // res.render('Edit',{'data':result});
        res.json(result);
    })
})
app.post('/update/:id',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty");
    mycol.updateOne({_id:new ObjectId (req.params.id)},
    { $set: {password:req.body.password, email:req.body.email}})
    .then((result)=>{
        // res.redirect("/showData");
        res.json(result);
    })
    .catch(error=> console.error(error))
})

app.get('/delete/:id',jsonParser,async(req,res)=>{
    let connection = await client.connect();
    let database = connection.db("khus");
    let mycol = database.collection("qwerty");
    mycol.deleteOne({_id:new ObjectId (req.params.id)})
    .then((result)=>{
        // res.redirect("/showData");
        res.json(result);
    })
})
