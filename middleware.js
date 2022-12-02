module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be Signed in');
        // console.log(`middle${req.session.returnTo}`)
        return res.redirect('/login');
    } else {
        next();
    }
}