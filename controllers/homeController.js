

 const getHomePage=(req,resp)=>{
        
        try{
            resp.render("index");

        }catch(error){
            console.log(error);
        }
    };
    
const getAboutPage=(req,resp)=>{
        
        try{
            resp.render("aboutPage");

        }catch(error){
            console.log(error);
        }
    }


module.exports= {
    getHomePage,
    getAboutPage
}