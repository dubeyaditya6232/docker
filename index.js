const express = require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const redis=require('redis');
let RedisStore=require('connect-redis')(session);
const cors=require('cors');


const config=require('./config/config');

const app = express();
const postRouter=require('./routes/postRouter');
const userRouter=require('./routes/userRouter');

const mongoUrl=`mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`
const connectWithRetry=()=>{
    mongoose.connect(mongoUrl)
    .then(()=>console.log("suceesfully connected to db"))
    .catch((e)=>{
        console.log(e);
        setTimeout(connectWithRetry,5000);
    });
}
connectWithRetry();

let redisClient=redis.createClient({
    host:config.REDIS_URL,
    PORT:config.REDIS_PORT
});

app.enable("trust proxy");

app.use(cors());
app.use(session({
    store: new  RedisStore({client:redisClient}),
    secret:config.SESSION_SECRET,
    cookie:{
        secure:false,
        resave:false,
        saveUninitialised:false,
        httpOnly:true,
        maxAge: 600000//milli second
    }
}));
app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.send("<h2>Testing docker file !! </h2>");
    console.log("nginx working but after some modification ");
});

app.use('/api/v1/posts',postRouter);
app.use('/api/v1/users',userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    console.log(`server running at port ${PORT}`);
});