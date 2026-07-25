import mongoose from 'mongoose';


 async function connectToDB(){
    try{
       await mongoose.connect(process.env.MONGO_URL);
        console.log("connection successful with databases");

    }
    catch(err){
        console.log(err);
        
    }
    
}

export default connectToDB;

