const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/url.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Shubhamtripathi:x7hZhxOWH9p6vHPT@thoriumbe.jzzvr.mongodb.net/Shubhamtripathi?authSource=admin&replicaSet=atlas-10zkbw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});