const dashBoardLoader = (req,res,next)=>{
    if(req.session.userInfo.type =="Admin"){
       next();
    }else{
        res.render("userdashboard");

    }

}
module.exports = dashBoardLoader;