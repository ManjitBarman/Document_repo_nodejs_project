const sendMail= async(name,email,user_id)=>{

    try {
        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'manjitbarman2016@gmail.com',
                pass:'ktxzqrrqilqyfqyg'
            }
        })
        const mailOptions={
            from:'manjitbarman2016@gmail.com',
            to:email,
            subject:'for testing mail',
            html:'<P>Hii '+name+',please click here to <a href="http://127.0.0.1.3000/verify?id='+user_id+'">verify</a> your mail</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent:- ",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message)     
    }

}

