let express = require('express');
let db = require('../db/database.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    try{
        passport.authenticate('local', {session: false}, (err, user) => {
            if(err || !user){
                console.log(err);
                return res.status(400).json({success : false, message : "로그인 실패"});
            }
            req.login(user, {session : false}, (err) => {
                if(err){
                    console.log(err);
                    return res.send(err);
                }
                const token = jwt.sign(
                    {user_id : user.user_id},
                    'jwt-secret-key',
                    {expiresIn: "7d"}
                );
                return res.json({success : true, message : "로그인 성공", token});
            });
        })(req,res);
    }catch(e){
        console.error(e);
        return next(e);
    }
};

const check = (req, res) => {
    res.json(req.decoded);
};

module.exports = {
    login,
    check
}