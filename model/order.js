const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  
        prodid:{
            type: String,
            requried: true

            },
            amount: { //how many bought
                type: Number,
                required: true
        
            }
    ,
    

    email:
    {
        type: String,
        required: true
    }
    


    
})
const orderModel = mongoose.model('Order',orderSchema);
module.exports = orderModel;