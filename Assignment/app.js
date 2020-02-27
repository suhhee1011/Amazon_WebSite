const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const productModel = require("./model/productDB");

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
    let errors =[];
    let successMessage="";
    let errorcheck =true;

    if(`${req.body.name}`.length<=0){
       errors.push({passwordError:"Please enter name"});

    }
    if(`${req.body.password}`!=`${req.body.passwordAgain}`){
        errors.push({PasswordAgainerror:"password is not matched"});
    }
    if(errorcheck =true){
    userInfo.push({name:`${req.body.name}`,email:`${req.body.email}`,password:`${req.body.password}`});
        successMessage ="You are successfully create an Account";
    }
    res.render("registration",{
        title: "registration",
        headingInfo:"registration" ,
        errors: error,    
        success: successMessage
    });


});
app.get("/login",(req,res)=>{
    let errors=[];
    if(`${req.body.email}`.length<=0){
        errors.push({emailError:"Please enter password"});
 
     }
     if(`${req.body.password}`.length<=0){
        errors.push({passwordError:"Please enter password"});
 
     }
     if(errors.length>0){
    res.render("login",{
        title: "login",
        headingInfo:"login",
        errormessage:errors,
        email:req.body.email,
        password:req.body.password
    });
}

});

app.post("/login",(req,res)=>{
    let message="";
    let loginSuccess = false;
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
    
    res.render("login",{
        title: "login",
        headingInfo:"login",
        Message: message
    });

});

const PORT = 3000;
app.listen(PORT,()=>{
    console.log("Web server is running");
});

