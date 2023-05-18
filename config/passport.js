let db = require('../db/database.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require('passport-local').Strategy;


const LocalStrategyOption = {
    userName : "user_id",
    userPassword : "user_password"
};

async function localVerify(user_id, password, done){
    let user;
    try{
        let sql = `SELECT * FROM User WHERE userId = ${user_id}`;
        await db.query(sql, async (err, rows, fields) =>{
            if(err){
                console.log(err);
                return done(null, false);
            }
            if(!rows[0]) return done(null, false);
            user = rows[0];

            console.log(password, user.password);
            const checkPassword = await bcrypt.compare(password, user.password);
            console.log(checkPassword);
            if(!checkPassword) return done(null, false);

            console.log(user);
            return done(null, user);
        })

    }catch(e){
        return done(e);
    }
}

const JWTStrategyOption = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'jwt-secret-key',
};
async function jwtVerift(payload, done){
    let user;
    try {
        var sql = 'select * from user where user_id = ?';
        var params = [payload.user_id];
        await conn.query(sql, params, function (err, rows, fields) {
          if(!rows[0]) return done(null, false);
          user = rows[0];
    
          console.log(user);
          return done(null, user);
        });
    }catch(e){
        return done(e);
    }
}

module.exports = () => {
    passport.use(new LocalStrategy(LocalStrategyOption, localVerify));
    passport.use(new JWTStrategy(JWTStrategyOption, jwtVerift));
}


