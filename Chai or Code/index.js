require('dotenv').config()

const express=require('express')

const app=express()
const port=4000

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.get('/twitter', (req,res)=>{
        res.send("I am tweeter")
})

app.get('/login', (req,res)=>{
    res.send('<h1> Login Page </h1>')
})

app.get('/youtube', (req,res)=>{
    res.send('<h2> Youtube </h2>')
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port: ${4000}`)
})
