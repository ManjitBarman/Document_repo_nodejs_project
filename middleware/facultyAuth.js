const isLogin= async(req,resp,next)=>{
    try {

        if(req.session.user_id){
            
        }
        else{
            resp.redirect('CSE')
        }
        next();
        
    } catch (error) {
        console.log(error.message);
    }

}

const isLogout= async(req,resp,next)=>{
    try {

        if(req.session.user_id){
            resp.redirect('faculty_profile')
        }
        next();
    } catch (error) {
        console.log(error.message);        
    }
}


//export midleware
module.exports={
    isLogin,
    isLogout
}