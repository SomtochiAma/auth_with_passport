const express = require('express');
const router = express.Router()


router.get('/', ensureAuthenticated, (req, res, next) => {
    res.render('index')
})

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();        
    } else {
        console.log(req.user)
        req.flash('error_msg', 'Log in to view your dashboard');
        res.redirect('user/login');
    }
}

module.exports = router;