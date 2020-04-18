const express = require('express');
const router = express.Router();
const productModel = require("../model/product");
const clientModel = require("../model/client");
const orderModel = require("../model/order");
const isLoggedIn = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");
const path = require("path");
//load product model

//show all products
router.get("/product",(req,res)=>{
    console.log("2");
    productModel.find()
    .then((products)=>{
        const productarr = products.map(product=>{
            return{
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                bestseller: product.bestseller,
                picture: product.picture
            }

        });
        res.render("product",{
            title: "Products",
             headingInfo:"Products",
            data: productarr

        })

    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));


    
});

router.post("/product",(req,res)=>{
    console.log("3");
    productModel.find({category:req.body.productmenu})
    .then((products)=>{
        const productarr = products.map(product=>{
            return{
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                bestseller: product.bestseller,
                picture: product.picture
            }

        });
        res.render("product",{
            title: "Products",
             headingInfo:"Products",
            data: productarr

        })

})
})


router.get("/productadd",isLoggedIn,dashBoardLoader,(req,res)=>{
    console.log("4");
    console.log("here")
    res.render("productadd",{
        title: "ProductADD",
        headingInfo:"ProductsAdd"

    });
});
router.post("/productadd",isLoggedIn,dashBoardLoader,(req,res)=>{
  
    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        bestseller: req.body.bestseller
       
        
    }
    console.log(req.files.picture.name);
    const product = new productModel(newProduct);
    product.save()
    .then((product)=>{  
        console.log(req.files.picture.name);
        //To rename the file so that the file name will not overwrite the other files.
       req.files.picture.name= `pic_${product._id}${path.parse(req.files.picture.name).ext}`;
       
        req.files.picture.mv(`public/pic/${req.files.picture.name}`)
        .then(()=>{
            
            productModel.updateOne({_id:product._id},{
                picture:req.files.picture.name
            })
            .then(()=>{
                res.redirect("/product");
            })
        })
    })
    .catch(err=> console.log(`Error happened when inserting in the database: ${err}`));
})
router.get("/productList",isLoggedIn,dashBoardLoader,(req,res)=>{

    productModel.find()
    .then((products)=>{
        const productarr = products.map(product=>{
            return{
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                bestseller: product.bestseller,
                picture: product.picture
            }
        });
        res.render("productList",{
            data: productarr
        })
    })
    .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));
})
router.get("/productedit/:id",isLoggedIn,dashBoardLoader,(req,res)=>{
    productModel.findById(req.params.id)
    .then((product)=>{
        const {_id,name,price,description,category,quantity,bestseller,picture} = product;
        res.render("productedit",{
            _id,
            name,
            price,
            description,
            category,
            quantity,
            bestseller,
            picture
        })
    })
    .catch(err=> console.log(`Error happened when editing in the database: ${err}`));
})
router.put("/update/:id",isLoggedIn,dashBoardLoader,(req,res)=>{
    const product = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        bestseller: req.body.bestseller

    }
    productModel.updateOne({_id:req.params.id},product)
    .then((product)=>{
        console.log("non");
        req.files.picture.name= `pic_${req.params.id}${path.parse(req.files.picture.name).ext}`;
        console.log(req.files.picture.name);
        req.files.picture.mv(`public/pic/${req.files.picture.name}`)
        .then(()=>{
            console.log(req.files.picture.name)
            productModel.updateOne({_id:req.params.id},{
                
                picture:req.files.picture.name

            })
            .then(()=>{
                res.redirect("/productList");

            })

        })
       

    })
    .catch(err=> console.log(`Error happened when updating in the database: ${err}`));
  
});

router.delete("/delete/:id",isLoggedIn,dashBoardLoader,(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/productList");

    })
    .catch(err=> console.log(`Error happened when deleting in the database: ${err}`));

})
router.get("/productDesc/:id",(req,res)=>{
    console.log("a");
    productModel.findById(req.params.id)
    .then((product)=>{
        console.log(req.params.id)
        
       let stockcheck = function(){
            if(product.quantity>0){
                return true;
            }
            else{
                return false;
            }
        

        }
        console.log("b");
        res.render("productDesc",{
            id: product._id,
            name:product.name,
            price:product.price,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            bestseller:product.bestseller,
            picture:product.picture,
            stockcheck:product.quantity>0
            
        })

    })
    .catch(err=>console.log(`Error -get-productdesc-findbyID: ${err}`))

})
router.get("/shoppingCart",isLoggedIn, (req,res)=>{
    let totalarr =[];
    let sum =0;
    var orderArray=[],productarr=[];

    console.log("1");
    
    orderModel.find({email:req.session.userInfo.email})
        .then((orders)=>{
          const orderArray =  orders.map(order =>{
              
          
          return{
            id: order._id,
            prodid: order.prodid,
            amount: order.amount,
            email: order.email
        }    
           
        })
        productModel.find()
        .then(categories=>{
            const cate = categories.map(category=>{
                return{
                    id: category._id,
                    name: category.name,
                    price: category.price,
                    description: category.price,
                    category: category.category,
                    quantity: category.quantity,
                    bestseller: category.bestseller,
                    picture: category.picture
                }
            })
      
            for(let temp2 =0;temp2<orderArray.length;temp2++){
        for(let temp =0;temp<cate.length;temp++){
           
            if(cate[temp].id==orderArray[temp2].prodid){
                let tempobj ={
                    prodid: String(orderArray[temp2].prodid),
                    amount: String(orderArray[temp2].amount),
                    email: String(orderArray[temp2].email),
                    picture: String(cate[temp].picture),
                    name: String(cate[temp].name),
                    total: orderArray[temp2].amount*cate[temp].price,
                    price: cate[temp].price,
                    quantity: cate[temp].quantity,
                    stockcheck:cate[temp].quantity>0

                }
                totalarr.push(tempobj);
                sum+=parseFloat(tempobj.total);
                break;
            }
        }
        }
        console.log(orderArray);
        console.log(sum);
           res.render(("shoppingCart"),{
               orderArr: totalarr,
               totalPrice : sum
              
           })
        })
            
            
       
        }).catch(err=>console.log(`error from shopping cart2 ${err}`))
        
})
      
router.post("/shoppingCart",isLoggedIn,(req,res)=>{
    
    var productobj;
    productModel.findById(req.body.id)
    .then((product) =>{
        var productobj = function(){
        return {
            id:product._id,
            name:product.name,
            quantity:product.quantiity,
            picture: product.picture,
            price: product.price
        }
    }
    const newOrder = {
        prodid: req.body.id,
        amount: req.body.howmany,
        email: req.session.userInfo.email,
    }
    const order = new orderModel(newOrder);
    order.save()
    .then(()=>
    { if(req.session.userInfo.type=="Admin"){
       
        res.render("admindashboard");

    }else{
        res.render("userdashboard");
    }
    })
    })
})
    
 


router.post("/placeOrder",isLoggedIn,(req,res)=>{
   
    let totalarr =[];
    let sum =0;
    var orderArray=[],productarr=[];

    console.log("1");
    
    orderModel.find({email:req.session.userInfo.email})
        .then((orders)=>{
          const orderArray =  orders.map(order =>{
              
          
          return{
            id: order._id,
            prodid: order.prodid,
            amount: order.amount,
            email: order.email
        }    
           
        })
        productModel.find()
        .then(categories=>{
            const cate = categories.map(category=>{
                return{
                    id: category._id,
                    name: category.name,
                    price: category.price,
                    description: category.price,
                    category: category.category,
                    quantity: category.quantity,
                    bestseller: category.bestseller,
                    picture: category.picture
                }
            })
      
        
        for(let temp =0;temp<cate.length;temp++){
            for(let temp2 =temp+1;temp2<orderArray.length;temp2++){
            if(temp.id==temp2.productId){
                let tempobj ={
                    prodid: String(orderArray[temp2].prodid),
                    amount: String(orderArray[temp2].amount),
                    email: String(orderArray[temp2].email),
                    picture: String(cate[temp].picture),
                    name: String(cate[temp].name),
                    total: orderArray[temp2].amount*cate[temp].price,
                    price: cate[temp].price,
                    quantity: cate[temp].quantity,
                    stockcheck:cate[temp].quantity>0

                }
                totalarr.push(tempobj);
                sum+=parseFloat(tempobj.total);
            }
        }
        }
        
            let text ="";
            for(let temp =0;temp<totalarr.length;temp++){
                text+=totalarr[temp].name+" - "+totalarr[temp].amount+"=> CDN$ "+totalarr[temp].total+"<br>";
            }
            
            text+="Your total puchased amount is CDN$ "+sum;
            

        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
          to: `${req.session.userInfo.email}`,
          from: `registration@seophoe.com`,
          subject: 'Your stuff is just start to delivery!',
         
          html: `Name: ${req.session.userInfo.firstname} ${req.session.userInfo.lastname}
                 email: ${req.session.userInfo.email}
                 Your purchase is in process. Thank you for using Seophoe<br> ${text}
                 `,
                 
        };
        sgMail.send(msg)
        .then(()=>{
            console.log("email sent");
            orderModel.deleteMany({email:req.session.userInfo.email})
            .then(()=>{
                if(req.session.userInfo.type=="Admin"){
       
                    res.render("admindashboard");
            
                }else{
                    res.render("userdashboard");
                }

            })
            
        
        })
              
           })
        
            
            
       
        }).catch(err=>console.log(`error from shopping cart2 ${err}`))



})

module.exports=router;