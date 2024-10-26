import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import router from './route/index.js';
import cors from 'cors';

const uri = process.env.ATLAS_URI;
const PORT = process.env.PORT || 3000;


// https://www.mongodb.com/docs/drivers/node/current/fundamentals/bson/undefined-values/
// ignore undefined fields when Model.find()
mongoose.connect(uri, { ignoreUndefined: true })
    .then(() => console.log("Mongo connected"))
    .catch((error) => console.error("Mongo connection error:", error));


const app = express();


app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello, Stand In!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});