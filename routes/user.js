const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const User = require('../modules/user_model');
const bcrypt = require('bcrypt-nodejs');
router.use(expressValidator());

router.get('/signup', (req, res, next) => {
    res.render('signup', {errors: null})
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/signup', (req, res, next) => {
    /* var username = req.body.username;
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2 */;

    
    req.checkBody('username', 'Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password1', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

    errors = req.validationErrors();
    // console.log(errors);

    if(errors) {
        res.render('signup', {
            errors: errors
        })
    } else {
        User.find({ email: req.body.email})
            .exec()
            .then( user => {
                if(user.length >= 1) {
                    return res.status(500).json({
                        mesg: 'Your Mail exists',
                    })
                } else {
                    bcrypt.hash(req.body.password1, null, null, function(err, hash) {
                        if(err) {
                            return res.status(500).json({
                                error: err,
                            });
                        } else {
                            const user = new User({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                            })
                            user.save(function(err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                req.flash('success_msg', 'You are registered and can now log in.');
                                res.redirect('/user/login')
                            });
                                /* .then(function(result) {
                                    console.log(result);
                                    req.flash('success_msg', 'You are registered and can now log in.');
                                    res.redirect('/user/login')
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    })
                                }) */
                        }
                    })
                }
            })
      /*   let newUser = new User({
            username: username,
            email: email,
            password: password1
        });

        User.checkIfUserExist(email, function(err, result) {
            if (err) throw err;

            if (result) {
                // req.flash('Your mail already exists proceed to login');
                res.redirect('/user/login');
            } else {
                User.createUser(newUser, function(err, user) {
                    if(err) throw err;
                    console.log(user);
                })
            }
        }) */
        .catch((err) => {
            console.log(err)
            req.flash('success_msg', 'You are already registered and can now log in');
            res.redirect('/user/login');
        })
    } 
})

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if(err) throw err;
            if(!user) {
                return done(null, false, { message: 'Unknown User'})
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if(isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Invalid Password'})
                }
            })
        }); 
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/user/login', failureFlash: true} ),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);
    res.redirect('/')
});

router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login')
});

module.exports = router;