const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const dotenv = require("dotenv/config");

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//express-session init
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
}))

//Passport init 
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', indexRouter);
app.use('/user', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}) 