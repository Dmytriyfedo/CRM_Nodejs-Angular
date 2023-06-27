const express = require('express')
const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
    destination(_req, _file, cb){
        cb(null, 'uploads/')
    },
    filename(_req, file, cb){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null, `${date}-${file.originalname}`)
    }

})

const fileFilter = (_req,file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null,false)
    }
}

const limits = {
    fileSize: 2000 * 2000 * 15
}


module.exports = multer({storage, fileFilter, limits})