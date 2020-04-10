const express = require('express')
const router = express.Router();
const clientModel = require("../model/client");
userInfo=[];

//load product model
const productModel = require("../model/product.js");
router.get("/",(req,res)=>{
 
    res.render("general/home",{
        title: "Home",
        headingInfo:"Home Page",
        productCategory: productModel.getCategories(),
        bestSell:productModel.getBestSellers()
    }); 

});
router.get("/registration",(req,res)=>{
    res.render("general/registration",{
        title: "registration",
        headingInfo:"registration",

       
    });

});
router.get("/login",(req,res)=>{
    let errors=[];
    
    
        res.render("general/login",{
            title: "login",
            headingInfo:"login"
        });

    


});
router.post("/registration",(req,res)=>{
    const {firstname,lastname,email}= req.body;
    let errors =[];
    let successMessage="";
    let errorcheck =true;
    
    if(`${req.body.firstname}`.length<=0){
        errors.push({firstnameError:"Please enter first name"});
 
     }else if(!/^[a-zA-Z\s]{2,}$/.test(`${req.body.firstname}`)){
        errors.push({firstnameError:"Please enter the first name only with letter"});
    }
    if(`${req.body.lastname}`.length<=0){
        errors.push({lastnameError:"Please enter last name"});
 
     }else if(!/^[a-zA-Z\s]{2,}$/.test(`${req.body.lastname}`)){
        errors.push({lastnameError:"Please enter the last name only with letter"});
    }
    if(`${req.body.email}`.length<=0){
        errors.push({emailError:"Please enter email"});
 
    }
    
      
    if(`${req.body.password}`.length<=0){
        errors.push({passwordError:"Please enter password"});
 
    }else if(!/^[a-z0-9]{6,12}$/.test(`${req.body.password}`)){
        errors.push({passwordError:"Please enter passwored between 6 to 12 characters and only with lower cases and numbers"});
    }

    if(`${req.body.password}`!=`${req.body.passwordAgain}`){
        errors.push({passwordAgainerror:"password is not matched"});
    }
    if(errors.length>0){
        res.render("general/registration",{
            title: "registration",
            headingInfo:"registration" ,
            errormessage: errors,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:req.body.password,
            passwordagarin:req.body.passwordAgain

        });
    }else{
        clientModel.findOne({email :`${req.body.email}`})
        .then((user)=>{
           //there is a matching emaiil
           //Show error
            if(user){
            errors.push({emailError:"please use other email"});
            res.render("general/registration",{
                title: "registration",
                headingInfo:"registration" ,
                errormessage: errors,
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password,
                passwordagarin:req.body.passwordAgain
    
            });
        }
        //No matching eroor
        else
        {
            const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const msg = {
  to: `${email}`,
  from: `registration@seophoe.com`,
  subject: 'Thank you for choose us!',
  text: 'Your account is successfully created. Thank you',
  html: `Name: ${firstname} ${lastname}
         email: ${email}
         `,
         
};
sgMail.send(msg)
.then(()=>{
    console.log("email sent");
 
       const newUser={
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
       }
       const client = new clientModel(newUser);
       client.save()
       .then(()=>{
           console.log(`Data saved`);
       })
       .catch(err=>console.log(`Error happened when inserting in the database :${err}`));
        res.render("general/dashboard",{
            title: "dashboard",
            headingInfo:"dashboard",
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname
           });

})
.catch(err=>{
    console.log(`Error ${err}`);

})
        }
        })
        .catch(err=>console.log(`Error happened when retrieving in the database :${err}`))



    
 }



});


router.post("/login",(req,res)=>{
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
        res.render("general/login",{
            title: "login",
            errormessage:errors,
            email:req.body.email,
            password:req.body.password
        });
    }
    else{
        res.render("general/login",{
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
module.exports=router;