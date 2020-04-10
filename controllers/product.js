const express = require('express')
const router = express.Router();

//load product model
const productModel = require("../model/product.js");

//show all products
router.get("/",(req,res)=>{
    res.render("product/product",{
        title: "Products",
        headingInfo:"Products",
        productPic: productModel.getAllProducts()
       
    });

});

module.exports=router;