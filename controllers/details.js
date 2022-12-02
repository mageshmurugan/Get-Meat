const Address = require('../models/address');


// module.exports.renderBuyMeat = async (req, res) => {
//     const add = await Address.find({ author: req.user._id });
//     console.log(add)
//     // .populate({
//     //     path: 'reviews',
//     //     populate: {
//     //         path: 'author'
//     //     }
//     // }).populate('author');
//     res.render('getMeat/confirmOrder', { add })
// }






// module.exports.buyMeat = (req, res) => {
//     // if (req.body) {
//     // const { quantity } = req.body;

//     // req.session.quantity = quantity;
//     // console.log(quantity)
//     res.redirect('/confirm')
//     // } else {
//     //     res.redirect('/')

//     // }

// }

module.exports.renderConfirm = async (req, res) => {
    const quantity = req.session.quantity;
    const amount = quantity * 300;
    const add = await Address.find({ author: req.user._id });


    if (add.length) {
        res.render('getMeat/confirmOrder', { quantity, amount, add })
        // res.render('getMeat/confirmOrder', { add })

    } else {
        res.render('getMeat/address')

    }
    // req.session.quantity = null;
}

// module.exports.confirm = async (req, res) => {
//     const { address } = req.body;
//     const m = address.split(',');

//     // for (let i = 0; i < m.length; i++) {
//     //     m[i] = m[i].charAt(0).toUpperCase() + m[i].slice(1);
//     // }
//     const tit = m.join(', ');
//     const add = new Address({ address: tit, author: req.user._id });
//     await add.save();
//     return res.redirect('/confirm')
// }

module.exports.renderAddress = async (req, res) => {
    res.render('getMeat/address')
}

module.exports.address = async (req, res) => {
    const { firstName, lastName, address, city, zipCode, state, landMark } = req.body;
    const m = address.split(',');
    const tit = m.join(', ');
    const add = new Address({ firstName, lastName, address: tit, city, zipCode, state, landMark, author: req.user._id });
    await add.save();
    res.redirect('/confirm')

}