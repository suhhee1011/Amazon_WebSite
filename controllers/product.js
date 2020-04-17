const express = require('express');
const router = express.Router();
const productModel = require("../model/product");
const isLoggedIn = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");
const path = require("path");
//load product model

//show all products
router.get("/product",(req,res)=>{
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


router.get("/productadd",(req,res)=>{
    console.log("here")
    res.render("productadd",{
        title: "ProductADD",
        headingInfo:"ProductsAdd"

    });
});
router.post("/productadd",(req,res)=>{
  
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
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                quantity: product.quantity,
                bestseller: product.bestseller
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

module.exports=router;