import express from 'express';
import mongoose from 'mongoose';
const app = express();

const port = 4000;
app.get('/', (req, res) => {
    console.log('A new request is Received');
    res.status(200).send('Welcome');
})


app.listen(port,'localhost',() => {
    console.log('⚙️ listening on' , port);
});