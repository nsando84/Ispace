const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/Users')


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" } , (email, password, done) => {
            User.findOne({ where: { email }})
            .then(user => {
                if(!user) {
                    console.log('did not match user')
                    return done(null, false, { message: 'Email or Password incorrect.'})
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if(isMatch) {
                        console.log('matched user')
                        return done(null, user)
                    } else {
                        console.log('did not match password')
                        return done(null, false, { message: 'Email or Password incorrect.'})
                    }
                })



            })
            .catch(err => console.log(err))
        })
    )

    passport.serializeUser(function(user, done) {
        console.log('serialize '+ user.id)
        done(null, user.id);
    });
    

    passport.deserializeUser(function (id, done) {
        User.findOne({ where: { id: id } }).then((user) => {
          done(null, user);
        });
      });



}



