const passport = require('passport');
const Otp = require('../models/otp');
const Otpcp = require('../models/otpcp');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const { findByUsername } = require('../models/otp');
// const { findByUsername } = require('../models/otp');



module.exports.renderSignUp = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    // const redirectUrl = req.session.returnTo;
    console.log(redirectUrl)
    res.render('users/index', { redirectUrl })
}

module.exports.signUp = async (req, res) => {
    const { username, name, password, confirmpassword } = req.body;
    // console.log(req.body)
    // const { email, username } = req.body;
    req.session.userst = { username, name, password, confirmpassword }
    // console.log(req.session.userst)
    const mail = await User.findOne({
        username: username.toLowerCase().trim()
    });

    if (mail) {
        console.log(mail)
        req.flash('success', ` Email is already registered`);
        res.redirect('/login')
    } else if (password != confirmpassword) {
        req.flash('error', `Password And Confirm Password are Not Same`);
        res.redirect('/signUp')
    }
    else {
        const OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });
        console.log(OTP)
        const hash = await bcrypt.hash(OTP, 12);
        const mai = await Otp.findOne({
            username: username
        });

        if (mai) {
            mai.otp = hash;
            await mai.save()
            const otps = mai._id;
            req.session.otp = otps;

        } else {
            const user = new Otp({ username: username, name: name, otp: hash });
            await user.save();
            const otps = user._id;
            req.session.otp = otps;
            req.session.password = password;
            console.log(req.session.otp)
            console.log(req.session.password)

        }
        req.flash('success', `Otp Sent to your email Successfully`);
        res.redirect('/otpVerify')
    }

}

module.exports.renderOtpVerify = (req, res) => {
    // const emails = req.session.userst.username;
    // res.render('users/otpVerify', { emails })
    res.render('users/otpVerify')
}

module.exports.otpVerify = async (req, res) => {
    // try {
    const { otp } = req.body;

    const otpVerify = await Otp.findOne({
        _id: req.session.otp
    });
    const deleteOtp = await Otp.deleteOne({
        _id: req.session.otp
    });
    // console.log(`1.......${otpVerify}`)
    const password = req.session.password;
    req.session.otp = null;
    req.session.password = null;
    // console.log(`2 ......${req.session.password}`)


    const validUser = await bcrypt.compare(otp, otpVerify.otp);
    if (validUser && otpVerify && password) {
        const user = await new User({
            username: otpVerify.username.toLowerCase(),
            name: otpVerify.name,
            // mobile: otpVerify.mobile
        });

        // user.save();
        // console.log('2.1')
        const registeredUser = await User.register(user, password);
        // console.log('2.1')



        // console.log(`3 ......${registeredUser}`)
        // console.log(`4 ......${deleteOtp}`)


        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;


        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to GetMeat ${user.name}`);
            // res.redirect(`${redirectUrl}`);
            res.redirect(`${redirectUrl}`);
        });
    } else {
        req.flash('success', `Incorrect Otp`);
        res.redirect('/signUp');
    }

    // } catch (e) {
    //     req.flash('error', e.message);
    //     res.redirect('/signUp');
    // }
}

module.exports.renderLogin = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';

    res.render('users/login', { redirectUrl })
}

module.exports.login = (req, res) => {

    // const { username } = req.body;
    // req.flash('success', `welcome back ${username}`);
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    console.log(`login ${redirectUrl}`)
    res.redirect(`${redirectUrl}`);
    // res.redirect(`/`);

}

module.exports.google = async (req, res, next) => {
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })(req, res, next)
}

module.exports.googleCallBack = async (req, res, next) => {
    req.flash('success', 'welcome back google user');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    // res.redirect('/');
    res.redirect(`${redirectUrl}`);

}

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Successfully Logged you Out');
        res.redirect('/')
    });

}

// module.exports.details

module.exports.renderChangePassword = (req, res, next) => {
    res.render('users/changePassword')
}

module.exports.changePassword = async (req, res, next) => {
    const { username, password, confirmpassword } = req.body;

    const cpg = await User.find({ username: username.toLowerCase(), googleId: { $gte: 0 } });
    const cp = await User.findByUsername(username.toLowerCase());
    console.log(`cp ${cp}`)
    console.log(`cpg ${cpg}`)
    if (cpg.length) {
        req.flash('success', 'Email is Registered by Google')
        res.redirect('/login')
    } else if (!cp) {
        req.flash('success', 'Email is Not Registered ')
        res.redirect('/signUp')
    } else if (password !== confirmpassword) {
        req.flash('success', 'Password and confirm password must Same ')
        res.redirect('/changePassword')
    }
    else {
        const OTP = otpGenerator.generate(4, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });
        console.log(OTP)
        const hash = await bcrypt.hash(OTP, 12);
        const mai = await Otpcp.findOne({
            username: username
        });

        if (mai) {
            mai.otp = hash;
            await mai.save()
            const otpscp = mai._id;
            req.session.otpcp = otpscp;
            req.session.passwordcp = password;
            req.session.usern = username;
            // console.log(req.session.otpcp)
            // console.log('if in change post')



        } else {
            const user = new Otpcp({ username: username, otp: hash });
            await user.save();
            const otpscp = user._id;
            req.session.otpcp = otpscp;
            req.session.passwordcp = password;
            req.session.usern = username;
            // console.log(req.session.otpcp)
            // console.log('else in change post')
            // console.log(req.session.passwordcp)

        }
        // req.flash('success', `${username}`)
        res.redirect('/confirmCp')
    }




    // else {
    //     if (username && password.length >= 6) {
    //         req.session.changeP = { username, password }
    //         res.redirect('/login')
    //     }

    // }
    // try {
    //     await cp.setPassword(password);
    //     await cp.save();
    //     console.log('wowww sucess')

    // } catch {
    //     console.log('failure')
    // }
    // console.log(cp)

};

module.exports.renderConfirmCp = (req, res, next) => {
    const username = req.session.usern;
    res.render('users/confirmCp', { username })
}

module.exports.confirmCp = async (req, res, next) => {
    const { otp } = req.body;
    // console.log(`confirmcp .....${otp}`)
    const otpVerify = await Otpcp.findOne({
        _id: req.session.otpcp
    });

    const deleteOtp = await Otpcp.deleteOne({
        _id: req.session.otpcp
    });
    // console.log(`1.......${otpVerify}`)
    const password = req.session.passwordcp;

    // console.log(`2 ......${req.session.password}`)

    const username = req.session.usern;
    // console.log(`confirmcp .....${otpVerify}`)

    // console.log(`confirmcp .....${username}`)

    const validUser = await bcrypt.compare(otp, otpVerify.otp);
    // console.log(`confirmcp valid User .....${validUser}`)

    const cp = await User.findOne({ username: username });
    // console.log(`confirmcp user .....${cp}`)

    if (validUser && otpVerify && password && cp) {
        // try {
        await cp.setPassword(password);
        await cp.save();
        req.session.otpcp = null;
        req.session.passwordcp = null;
        req.session.usern = null;
        // console.log('wowww sucess')
        req.flash('success', 'Successfully Changed')
        return res.redirect('/login')



        // } catch {
        //     req.flash('success', 'Wrong Otp 1')
        //     return res.redirect('/changePassword')
        // }
    } else {
        req.session.otpcp = null;
        req.session.passwordcp = null;
        req.session.usern = null;

        req.flash('success', 'Wrong Otp')
        return res.redirect('/changePassword')
    }
    // try {
    //     await cp.setPassword(password);
    //     await cp.save();
    //     console.log('wowww sucess')

    // } catch {
    //     console.log('failure')
    // }
}