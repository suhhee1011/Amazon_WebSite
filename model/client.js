const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const bcrypt = require("bcryptjs");
  const clientSchema = new Schema({

    
    firstname: { 
        type:String,
        required: true},
    lastname: { 
        type:String,
        required: true},
    email: { 
        type:String,
        required: true},
    password: { 
        type:String,
        required: true},
    type:
    {
        type:String,
        default:"User"
    },
  
    
        

    
    
  });
  clientSchema.pre("save",function(next){
      //salt= random generated characters or strings
        bcrypt.genSalt(10)
        .then((salt)=> {
            bcrypt.hash(this.password,salt)
            .then((encryptPasword)=>{
                    this.password = encryptPasword;
                    next();

            })
            .catch(err=>console.log(`Error occured when hasing ${err}`));

        })
        .catch(err=>console.log(`Error occured when salting ${err}`));

  })
  var clientModel = mongoose.model('Client', clientSchema);
  module.exports = clientModel;