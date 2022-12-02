if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require("connect-mongo");
const Quantity = require('./models/quantity');
const Otp = require('./models/otp');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const _passport = require('./utils/passport');
const userRoutes = require('./routes/users');
const detailRoutes = require('./routes/details');
const Address = require('./models/address');



const app = express();
app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 4 * 12,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 4 * 12
    }
}

app.use(session(sessionConfig));
app.use(flash());


_passport.passportInit(app);
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.returnTo = req.originalUrl;
    // console.log(`app.use....${req.session.returnTo}`)  
    // console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.primary = req.flash('primary');
    next();
})

app.use('/', userRoutes)
app.use('/', detailRoutes)


app.get('/', (req, res) => {
    res.render('getMeat/home')
})
app.post('/', async (req, res) => {
    const { quantity } = req.body;
    req.session.quantity = quantity;
    console.log(quantity)
    res.redirect('/confirm')

})



// app.get('/buyMeat', async (req, res) => {
//     const add = await Address.find({ author: req.user._id });
//     console.log(add)
//     // .populate({
//     //     path: 'reviews',
//     //     populate: {
//     //         path: 'author'
//     //     }
//     // }).populate('author');
//     res.render('getMeat/confirmOrder', { add })
// })

// app.post('/buyMeat', async (req, res) => {
//     const { address } = req.body;
//     const add = new Address({ address: address, author: req.user._id });
//     await add.save();
//     res.redirect('/')
// })



// app.get('/signUp', (req, res) => {
//     res.render('users/index')
// })

// app.post('/signUp', async (req, res) => {
//     const { username, name, mobile, password, confirmpassword } = req.body;
//     // console.log(req.body)
//     // const { email, username } = req.body;
//     req.session.userst = { username, mobile, name, password, confirmpassword }
//     console.log(req.session.userst)
//     const mail = await User.findOne({
//         username: username
//     });

//     if (mail) {
//         console.log(mail)
//         req.flash('error', `The Email is already registered`);
//         res.redirect('/signUp')
//     } else if (password != confirmpassword) {
//         req.flash('error', `Password And Confirm Password are Not Same`);
//         res.redirect('/signUp')
//     }
//     else {
//         const OTP = otpGenerator.generate(6, {
//             digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
//         });
//         console.log(OTP)
//         const hash = await bcrypt.hash(OTP, 12);
//         const mai = await Otp.findOne({
//             username: username
//         });

//         if (mai) {
//             mai.otp = hash;
//             await mai.save()
//             const otps = mai._id;
//             req.session.otp = otps;

//         } else {
//             const user = new Otp({ username: username, name: name, mobile: mobile, otp: hash });
//             await user.save();
//             const otps = user._id;
//             req.session.otp = otps;
//             req.session.password = password;
//             console.log(req.session.otp)
//             console.log(req.session.password)

//         }
//         req.flash('success', `Otp Sent to your email Successfully`);
//         res.redirect('/otpVerify')
//     }

// })

// app.get('/otpVerify', (req, res) => {
//     // const emails = req.session.userst.username;
//     // res.render('users/otpVerify', { emails })
//     res.render('users/otpVerify')
// })

// app.post('/otpVerify', async (req, res) => {
//     // try {
//     const { otp } = req.body;

//     const otpVerify = await Otp.findOne({
//         _id: req.session.otp
//     });
//     const deleteOtp = await Otp.deleteOne({
//         _id: req.session.otp
//     });
//     // console.log(`1.......${otpVerify}`)
//     const password = req.session.password;
//     req.session.otp = null;
//     req.session.password = null;
//     // console.log(`2 ......${req.session.password}`)


//     const validUser = await bcrypt.compare(otp, otpVerify.otp);
//     if (validUser && otpVerify && password) {
//         const user = await new User({
//             username: otpVerify.username,
//             name: otpVerify.name,
//             mobile: otpVerify.mobile
//         });

//         // user.save();
//         // console.log('2.1')
//         const registeredUser = await User.register(user, password);
//         // console.log('2.1')



//         // console.log(`3 ......${registeredUser}`)
//         // console.log(`4 ......${deleteOtp}`)


//         // const redirectUrl = req.session.returnTo || '/';
//         // delete req.session.returnTo;


//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', `Welcome to GetMeat ${user.name}`);
//             // res.redirect(`${redirectUrl}`);
//             res.redirect(`/signUp`);
//         });
//     } else {
//         req.flash('error', `Wrong Otp`);
//         res.redirect('/signUp');
//     }

//     // } catch (e) {
//     //     req.flash('error', e.message);
//     //     res.redirect('/signUp');
//     // }
// })
// app.get('/login', (req, res) => {
//     res.render('users/login')
// })
// app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {

//     const { username } = req.body;
//     req.flash('success', `welcome back ${username}`);
//     // const redirectUrl = req.session.returnTo || '/campgrounds';
//     // delete req.session.returnTo;
//     // console.log(`login ${redirectUrl}`)
//     res.redirect('/');
// });

// app.get('/auth/google', async (req, res, next) => {
//     passport.authenticate('google', {
//         scope: ['email', 'profile']
//     })(req, res, next)
// });

// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', failureFlash: true, successFlash: true }), async (req, res, next) => {
//     req.flash('success', 'welcome back google user');
//     // const redirectUrl = req.session.returnTo || '/';
//     // delete req.session.returnTo;
//     res.redirect('/');
// });











app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went Wrong';

    if (err.message === 'Page Not Found') {
        req.flash('success', `PAGE NOT FOUND`)
        res.redirect('/')
    } else if (err.name === 'CastError') {
        req.flash('success', 'PAGE NOT FOUND')
        res.redirect('/')
    }
    else if (err.name === "Error") {
        req.flash('primary', err.message)
        res.redirect('/')

    }
    else {
        res.status(statusCode).render('error', { err });
    }
    // res.send('Oh Boy,Something Went Wrong')
})




const port = process.env.PORT

app.listen(port, () => {
    console.log(`SERVING ON PORT${port}`)
})