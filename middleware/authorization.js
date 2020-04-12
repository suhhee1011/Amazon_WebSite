const dashBoardLoader = (req,res)=>{
    if(req.session.userInfo.type =="Admin"){
       res.render("general/admin-profile");
    }else{
        res.render("general/userdashboard");

    }

}
module.exports = dashBoardLoader;