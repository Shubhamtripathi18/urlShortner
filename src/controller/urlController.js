const shortid = require('shortid')
const urlModel = require('../models/urlModel')
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient(
  19107,
  "redis-19107.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("AXeuNDuY3jAJcPsMxxDzaJfBGKvvbC1v", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});


const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
//  what is promisify ??????//


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  
  const isValidUrl=/http(s?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

  
  const createUrl = async function (req, res) {
    try {
        const longUrl=req.body.longUrl
        const baseUrl="http://localhost:3000"
  
        if (!isValid(longUrl)) {
          res.status(400).send({ status: false, message: "URL is required" });
          return;
        }
  
      if(!isValidUrl.test(longUrl)) {
          res.status(400).send({ status: false, msg: "Plz enter valid URL" });
          return;
          }
          const isUrlPresent= await urlModel.findOne({longUrl:longUrl})
          if(isUrlPresent){
          res.status(200).send({status:true, message:`${isUrlPresent.shortUrl},  "this is the short url that already created for this URL"`})
          return
        }
          
  
        const urlCode=shortid.generate()
        const shortUrl=baseUrl+ '/' +urlCode
        console.log(shortid.generate());
  
       const urlCreated=await urlModel.create({
            urlCode,
            longUrl,
            shortUrl
  
        })
  
        res.status(201).send({status:true, message:"Short Url created successfully!",data:urlCreated})
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };


  const getCode= async (req, res) => {
    try {
        const url = await urlModel.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            
            return res.redirect(url.longUrl)
        } else {
            return res.status(404).json('No URL Found')
        }

    }
    
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
}


module.exports = {createUrl, getCode}