require('dotenv').config();
const cloudinary = require('cloudinary');
const express = require('express');
const app  = express();
const cors  = require('cors');
app.use(cors())
const morgan = require('morgan');
const dbConnect = require('./db');
const cookieParser = require('cookie-parser')

const errorMiddleware = require('./middleware/errorMiddleware');


const port = process.env.PORT || 6000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))


app.use('/api/auth',require('./routes/authRoute'))
app.use('/api/conversation',require('./routes/conversationRoute'))
app.use('/api/message',require('./routes/messageRoute'))



app.use(errorMiddleware)

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found')
})


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



app.listen(port , ()=>{
    dbConnect();
    console.log(`Server is listen at http://localhost:${port}`)
})