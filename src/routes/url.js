const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')

const router = express.Router()

const Url = require('../models/urlModel')
const urlController = require('../controller/urlController');

const baseUrl = 'http:localhost:3000'
router.post('/shorten', urlController.createUrl);
router.get('/:urlCode', urlController.getCode);

module.exports = router