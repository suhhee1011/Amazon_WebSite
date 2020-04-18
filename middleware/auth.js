const isLoggedIn = (req,res,next)=>{
    if(req.session.userInfo){
        next();
    }else{
        res.render("login"),{
            title: "login",
            headingInfo:"login"
        }

    }

}
module.exports = isLoggedIn;