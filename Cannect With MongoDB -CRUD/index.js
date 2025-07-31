const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/NodeJS")
.then(()=>{
    console.log("DB Success!")
}).connect((error)=>{
    console.error("Failed!")
})

//Schema: Structure of the document

const userSchema=new mongoose.Schema({
    name:String,
    marks:Number,

})

const UserModel=new.mongoose.model("user", userSchema);
function getUserData(){
    let data=UserModel.find();
    console.log(data);
}

async function createUserdata(){
    await UserModel.insertmany([{
        name:"sagar",
        marks;100,

    }])

    console.log(user)
}