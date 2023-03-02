const express=require("express");
const  path=require("path");
const fs=require("fs");
const app=express();
const port=80;
//NOTE: Before running nodemon  must go inside folder Dance-Website and simply type:nodemon Dance-website.js.
/*Here we can simply run this code and as we have made a local server inside this code, so we don't need nodemon but it won't update automatically. So everytime we save data in DB we have to  rerun the server.Also many a times running it won't include the css file
directly, so use nodemon Dance-website and if error comes as app not defined then do npm install express --save, even if it's installed cuz if we install  express in some other folder then it won't work here, so reinstall express to resolve any error.*/
//NOTE: To see data stored first open powershell/terminal in vs-code and type mongod to connect to mongod and then open another terminal and type mongo and thne show dbs, then choose the database(here it's ContactDance), then show collections(Here it's contacts), then db.contacts.find(). If whole db contents can't be seen then type 'it', to get whole documents under collection contacts.
const bodyparser=require('body-parser');
//we won't be using body-parser module ,cuz it has already been included in express.To save data in DB by post request in EXPRESS then we need to install body parser(npm install body-parser --save)

app.use(express.urlencoded({  extended: true }));//They are used for body-parser, but without them also body-parsing will be done cuz after express 4.5 version ,it's present implicitly in express. Also we will get some error like body-parser is deprecated , it just means body-parser which we are using is out-dated ,so ignore these warnings cuz body-parser will work and parsing will be done of I/P body received from user cuz it's present implicitly in express.
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/ContactDance',{useNewUrlParser:true,useUnifiedTopology:true,});
let db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open',function()
{
    //we are connected;
    console.log("We are connected bro/sis..")
});
//Define MONGOOSE SCHEMA
let ContactSchema=new mongoose.Schema({name:String,Phone:String,Email:String,Address:String,Concern:String});//Note:Always keep the fields/properties of schema same as given in type of input section of contact.
let Contact=mongoose.model('Contact',ContactSchema);
//EXPRESS specific stuff
app.use('/static',express.static('static'))//For serving static files
app.use(express.urlencoded())

//PUG specific stuff(To install pug: do npm install pug --save)
app.set('view engine','pug')//set the template engine as pug.
app.set('views',path.join(__dirname,'views'))//set the view directory.
//ENDPOINTS
app.get('/',(req,res)=>{
   
    const params={}
/*Here we could have directly used index.pug and our code would have worked fine  but localhost/contact won't open a separate contact page but we wanted to show how to use template and then fill the content and all the parameters. So, here home.pug will use the template base.pug and would all the content,body,parameters using by matching the blocks.  */
    res.status(200).render("home.pug",params);
})
app.get('/contact',(req,res)=>{
   
    const params={}
/*Here contact.pug would point ot a separate pug file for contact part ,and we can access it using localhost/contact. */
    res.status(200).render("contact.pug",params);
})
//It manages post request.
app.post('/contact',(req,res)=>{let MyData=new Contact(req.body);//We are saving the I/P data to MyData object/document of MongoDB, which we then save it and return a promise by using then() that data is saved in DB by using below code.
MyData.save().then(()=>{res.send("This item has been saved to the Database")}).catch(()=>{res.status(400).send("Item was not saved to the Database.")});
//res.status(200).render('contact.pug');
});

//START THE SERVER
app.listen(port,()=>{console.log(`The application started successfully on port ${port}`);})
