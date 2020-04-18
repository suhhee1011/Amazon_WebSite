const express = require('express');
const router = express.Router();
const clientModel = require("../model/client");
const productModel = require("../model/product");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");



router.get("/",(req,res)=>{
   
    productModel.find({bestseller:true})
    .then(bests=>{
        const bestsells = bests.map(best=>{
            return{
                id: best.id,
                name: best.name,
                price: best.price,
                description: best.price,
                category: best.category,
                quantity: best.quantity,
                bestseller: best.bestseller,
                picture: best.picture
            }
        })
        productModel.find()
        .then(categories=>{
            const cate = categories.map(category=>{
                return{
                    id: category.id,
                    name: category.name,
                    price: category.price,
                    description: category.price,
                    category: category.category,
                    quantity: category.quantity,
                    bestseller: category.bestseller,
                    picture: category.picture
                }
            })
       
           
                for(let i =0;i<cate.length;i++){
                    for(let j =i+1;j<cate.length;j++){
                    if(cate[i].category ==cate[j].category){
                        cate.splice(i,1);
                    }
                    }
                }
                while(cate.length>4){
                cate.pop();
                }
            
            while(bestsells.length>4){
                bestsells.pop();
            }
       res.render("home",{
        title: "Home",
        headingInfo:"Home Page",
        productCategory: cate,
        bestSell: bestsells
    });
})
    .catch(err=>console.log(`Error happened when get category  :${err}`));
})
        .catch(err=>console.log(`Error happened when get bestseller  :${err}`));

   

    
});

 

router.get("/registration",(req,res)=>{
    res.render("registration",{
        title: "registration",
        headingInfo:"registration",
    });
});
router.get("/login",(req,res)=>{
        res.render("login",{
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
        res.render("registration",{
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
            res.render("registration",{
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
        res.render("dashboard",{
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
    clientModel.findOne({email:req.body.email})
    .then(user=>{

        const errors= [];

        //email not found
        if(user==null)
        {   
             errors.push({passwordError:"Sorry, your email and/or password incorrect "});
            res.render("login",{
                errormessage:errors
            });
                
        }

        //email is found
        else
        {
           
            bcrypt.compare(req.body.password, user.password)
            .then(isMatched=>{
                
                if(isMatched)
                {
                    //cretae our sessoin
                    req.session.userInfo = user;
                   
                 res.redirect("/profile");
        
                }

                else
                {
                    
                    errors.push({passwordError:"Sorry, your email and/or password incorrect "});
                   
                    res.render("login",{
                        errormessage:errors
                    })
                }

            })
            .catch(err=>console.log(`Error ${err}`));
        }


    })
    .catch(err=>console.log(`Error ${err}`));
   
   

});
router.get("/logout",(req,res)=>{
 
    req.session.destroy();
   
    res.redirect("login"); 
    
});
router.get("/profile",isAuthenticated,dashBoardLoader,(req,res)=>{
    res.render("admindashboard");
})




router.get("/dashboard",(req,res)=>{
    res.render("dashboard",{
        title: "dashboard",
        headingInfo:"dashboard",
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname
       });

})

module.exports=router;
