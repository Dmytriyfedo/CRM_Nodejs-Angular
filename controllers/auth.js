const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const keys = require('../config/keys.js')
const errorHandler = require('../utils/errorHandler.js')

module.exports.login = async function(req,res){
    
    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult){
            //Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60*60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else{
            //Пароли не совпали
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова'
            })
        }        
    }else{
        //Пользователя нет, ошибка
        res.status(404).json({
            message: 'Такой email не зарегистрирован. Попробуйте другой.'
        })
    }
}


module.exports.register = async function(req,res){
    // email password

    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //Пользователь существует надо отдать ошибку
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    }else{
        //нужно создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
    try{
        await user.save()
        res.status(201).json(user)
    }catch(e){
        errorHandler(res,e)
    }

    }
}