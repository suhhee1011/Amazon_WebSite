const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const productSchema = new Schema({

    
    name: { 
        type:String,
        required: true},
    price: { 
        type:Number,
        required: true},
    description: { 
        type:String,
        required: true},
    category: { 
        type:String,
        required: true},
    quantity: { 
            type:Number,
            required: true},
    bestseller:
    {
        type:Boolean,
        default:false
    },
    picture:
    {
        type: String
     
    }
    
  });

var productModel = mongoose.model('Product', productSchema);

/*
var cate = function(){
    var tempcate=[];
    productModel.findOne({category:"Men's Clothes"})
    .then(product =>{ tempcate.push(product);})
    .catch(err=>console.log(`Error happened when get category :${err}`));
    productModel.findOne({category:"Woman's Clothes"})
    .then(product =>{ tempcate.push(product);})
    .catch(err=>console.log(`Error happened when get category :${err}`));
    productModel.findOne({category:"Beauty and personal care"})
    .then(product =>{ tempcate.push(product);})
    .catch(err=>console.log(`Error happened when get category :${err}`))
    productModel.findOne({category:"Home and Kitchen"})
    .then(product =>{ tempcate.push(product);})
    .catch(err=>console.log(`Error happened when get category :${err}`))
    return tempcate;
}

var best = function(){
    
    productModel.find({bestseller:true})
    .then(bests=>{
        const bestsells = bests.map(best=>{
            return{
                id: best.id,
                title: best.title,
                price: best.price,
                description: best.price,
                category: best.category,
                quantity: best.quantity,
                bestseller: best.bestseller,
                picture: best.picture
            }
        })
        return bestsells;
        })
    
   
    .catch(err=>console.log(`Error happened when get bestseller :${err}`));
 return best;
       
}
*/
  module.exports = productModel;
 
  