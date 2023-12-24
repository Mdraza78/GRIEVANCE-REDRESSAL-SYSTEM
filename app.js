const express = require('express');
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const port = 8080;
const complain=require('./complain');
const user=require("./user");
const session = require('express-session');

mongoose.connect("mongodb://127.0.0.1:27017/Brandnew-Grs");

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
 }));

app.get('/', (req, res) => {
res.render("welcome.ejs")
})

app.get('/home', (req, res) => {
res.render("home.ejs")
 })


 app.get('/admin', (req, res) => {
  res.render("admin.ejs");
 });

 
app.get('/register',(req,res)=>{
  res.render('register.ejs');
})

app.get('/complain',(req,res)=>{
  res.render("complain");
})

app.get('/login',(req,res)=>{
  res.render("login.ejs")
})

app.get('/addepartment',(req,res)=>{
  res.render('addepartment.ejs');
})

app.get('/usermanagement',(req,res)=>{
  user.find({}).then(function(users){
    res.render('usermanagement.ejs',{usersList:users})
  }).catch(function(err){
    console.log(err)
  })
})

app.get('/workassesment',(req,res)=>{
  complain.find({}).then(function(complains){
    res.render("workassesment.ejs",{complainsList:complains})
  }).catch(function(err){
    console.log(err)
  })
})
// app.post('/login', async (req, res) => {
//  const username=req.body.email;
//  const password=req.body.password;

//  user.findOne({email:username}).then((foundUser)=>{
//   if(foundUser) {
//     // bcrypt
//     bcrypt.compare(password, foundUser.password, function(err, result) {
//       if(result==true){
//         if (foundUser.category === 'admin') {
//           res.redirect("/admin");
//         } else {
//           res.redirect("/home");
//         }
//       }
//   });
//  }
// })
// .catch((err)=>{
//   console.log(err)
// })
// });

app.post('/login', async (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  try {
    const foundUser = await user.findOne({ email: username });

    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result === true) {
          //Store the user's email in the session
          req.session.email = foundUser.email;
          if(foundUser.category==='Admin'){
            res.redirect('/admin')
          }
          else{
            res.redirect('/home')
          }
        } 
      });
    } 
    else{
      res.redirect('/login')
    }
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});

app.post("/submit",(req,res)=>{
  const formdata=new complain({
    Name:req.body.name,
    collegeId:req.body.collegeid,
    Title:req.body.title,
    Details:req.body.details,
    Priority:req.body.priority,
    date:req.body.date,
    department:req.body.Department
  })
    formdata.save();
    res.redirect("/home")
})

app.get("/index",(req,res)=>{
  res.render("index.html")
})

app.get('/myprofile', async (req, res) => {
  try {
    // Retrieve the email from the session
    const userEmail = req.session.email;

    // Find the user based on the email
    const foundUser = await user.findOne({ email: userEmail });

    if (foundUser) {
      res.render('myprofile.ejs', { user: foundUser });
    } else {
      // Handle the case where the user is not found
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});


app.get("/register",(req,res)=>{

  res.render("register.ejs")
})

app.post("/register",async(req,res)=>{
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userdata = new user({
      Name: req.body.name,
      category: req.body.customerType,
      phoneno: req.body.phno,
      email: req.body.email,
      password: hashedPassword,
      collegeId:req.body.collegeid
    });

    userdata.save().then(() => {
    }).catch((err) => {
      console.log(err);
    });
 } catch (err) {
    console.log(err);
 }
 if (req.body.customerType === 'Admin') {
  res.redirect("/login")
} else {
  res.redirect("/login")
}  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
