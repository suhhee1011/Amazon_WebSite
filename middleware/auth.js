const isLoggedIn = (req,res,next)=>{
    if(req.session.userInfo){
        next();
    }else{
        res.redirect("/general/login");

    }

}
module.exports = isLoggedIn;