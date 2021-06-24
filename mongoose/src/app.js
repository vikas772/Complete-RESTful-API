const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://localhost:27017/vikas",{useNewUrlParser : true, useUnifiedTopology : true})
.then(()=>console.log("COnnection Done...."))
.catch((err)=> console.log(err));


const playListSchema = new mongoose.Schema({
    name : {
       type: String,
       required : true,
       unique : true, //it is not a validator, it check for uniuqe name
       lowercase : true,
       trim : true

    },
    ctype : String,
    video : Number,
    author : String,
    email :{ 
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Emails is invalid");
            }
        }
    },
    active : Boolean,
    Date : {
        type : Date,
        default : Date.now
    }
})


const Playlist = new mongoose.model("Playlist", playListSchema);

const createDocument = async() => {
    try{
        const reactPlaylist = new Playlist({
            name : "NodeJS",
             ctype : "BEnd",
             video : 50,
             author : "Vikas",
             email : "vikas.chauhan@gmail.com",
             active : true
        })
        const JsPlaylist = new Playlist({
            name : "JS",
             ctype : "BEnd",
             video : 150,
             author : "Vikas2",
             active : true
        })
        
        const result =  await reactPlaylist.save(); //to insert one doc 
        //const result =  await Playlist.insertMany([reactPlaylist, JsPlaylist]); //to insert many
        console.log(result);
    }
    catch(err){
        console.log(err);
    } 
}

  createDocument();

const getDocument = async() => {
   // const result = await Playlist.find({ctype : "BEnd"})
   const result = await Playlist
    .find({video: {$gt :50}})
    .select({name : 1})
    //.limit(1);
    console.log(result);
}

//getDocument();

const updateDocument = async(_id) => {
    try{
        const result = await Playlist.findByIdAndUpdate({_id}, {
            $set : {
                name : "AMerica1"
            }
        }, {
            new : true,
            useFindAndModify : false
        }
        );

        console.log(result);

    }catch(err){
        console.log(err);
    }
    
    
   
}

//updateDocument("60caff2bc66c002bdc4ddf3b");

const deleteDocument = async(_id)=> {
    try{
    //const result = await Playlist.deleteOne( {_id}); will show only count 
    const result = await Playlist.findByIdAndDelete( {_id});
    console.log(result);
    }
    catch(err){
        console.log(err);
    }
}

//deleteDocument("60caff2bc66c002bdc4ddf3b");

