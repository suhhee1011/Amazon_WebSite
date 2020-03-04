const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const productModel = require("./model/productDB.js");
require('dotenv').config({path:"./config/keys.env"});

const app = express();

app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

userInfo=[];

app.get("/",(req,res)=>{
 
    res.render("home",{
        title: "Home",
        headingInfo:"Home Page",
        productCategory: productModel.getCategories(),
        bestSell:productModel.getBestSellers()
    });

});
app.get("/products",(req,res)=>{
    res.render("products",{
        title: "Products",
        headingInfo:"Products",
        productPic: productModel.getAllProducts()
       
    });

});
app.get("/registration",(req,res)=>{
    res.render("registration",{
        title: "registration",
        headingInfo:"registration",

       
    });

});

app.post("/registration",(req,res)=>{
    const {name,email}= req.body;
    let errors =[];
    let successMessage="";
    let errorcheck =true;
    
    if(`${req.body.name}`.length<=0){
        errors.push({nameError:"Please enter name"});
 
     }else if(!/^[a-zA-Z\s]{2,}$/.test(`${req.body.name}`)){
        errors.push({nameError:"Please enter the right name only with number"});
    }
    if(`${req.body.email}`.length<=0){
        errors.push({emailError:"Please enter email"});
 
    }
    if(`${req.body.password}`.length<=0){
        errors.push({passwordError:"Please enter password"});
 
    }else if(!/^[a-z0-9]{6,12}$/.test(`${req.body.password}`)){
        errors.push({passwordError:"Please enter passwored between 6 to 12 characters and only with lower cases and numbers"});
    }

    if(`${req.body.passwordAgain}`.length<=0){
        errors.push({passwordAgainError:"Please enter password again"});
 
    }else if(`${req.body.password}`!=`${req.body.passwordAgain}`){
        errors.push({passwordAgainerror:"password is not matched"});
    }
    if(errors.length>0){
        res.render("registration",{
            title: "registration",
            headingInfo:"registration" ,
            errormessage: errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordagarin:req.body.passwordAgain

        });
    }else{
   // userInfo.push({name:`${req.body.name}`,email:`${req.body.email}`,password:`${req.body.password}`});
       // using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const msg = {
  to: `${email}`,
  from: `registration@seophoe.com`,
  subject: 'Thank you for choose us!',
  text: 'Your account is successfully created. Thank you',
  html: `Name: ${name}
         email: ${email}
         `,
         
};
sgMail.send(msg)
.then(()=>{
    console.log("email sent");

})
.catch(err=>{
    console.log(`Error ${err}`);

})
    
res.render("dashboard",{
    title: "dashboard",
    headingInfo:"dashboard",
    email: req.body.email,
    name: req.body.name
});
    }



});
app.get("/login",(req,res)=>{
    let errors=[];
    
    
        res.render("login",{
            title: "login",
            headingInfo:"login"
        });

    


});

app.post("/login",(req,res)=>{
    const errors=[];
    let message="";
    let loginSuccess = false;
    if(`${req.body.email}`==""){
        errors.push({emailError:"Please enter email"});
 
     }
     if(`${req.body.password}`.length<=0){
        errors.push({passwordError:"Please enter password"});
 
     }
     if(errors.length>0){
        res.render("login",{
            title: "login",
            errormessage:errors,
            email:req.body.email,
            password:req.body.password
        });
    }
    else{
        res.render("login",{
            title: "login",
            headingInfo:"login",
            Message: "Login Success"
        });
    }
    /*
    for(let i =0;i<userInfo.size;i++){
        if(`${req.body.password}`==userInfo[i]){
            message= "Login Success"
            loginSuccess = true;
            break;
        }
      
    }
    if(loginSuccess ==false){
        message="Try Again, Or Create an New accont"
    }
   */ 
   

});

const PORT = process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log("Web server is running");
    console.log(PORT);
});

