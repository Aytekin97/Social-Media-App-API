const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan =require('morgan');
const bodyParser = require('body-parser');
const cookieParse = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs').promises;
const cors = require('cors');
const dotenv= require('dotenv');


dotenv.config();

//db
mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('Db Connected'));

mongoose.connection.on('error',err=> {
    console.log(`Db Connection Error : ${err.message}`)
});


const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectionRoutes = require("./routes/connection");

//get API docs
app.get('/', async (req, res) => {
    try {
      // Using fs.promises.readFile with proper arguments
      const data = await fs.readFile('docs/APIDocs.json', 'utf8');
      const docs = JSON.parse(data);
      res.json(docs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParse());

const allowedOrigins = [
  'https://social-media-app-front-end-production.up.railway.app',
  'http://localhost:3000' // for local development
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny request
    }
  },
}));


app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", connectionRoutes);


app.use(function (err,req,res,next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json({error:'invalid user, please login first...'})
    }
});

const port = process.env.Port || 8081;
app.listen(port,()=>
{ console.log(`Serve is listening on port: ${port}`)
});