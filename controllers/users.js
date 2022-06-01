const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registerdUser = await User.register(user, password)
        req.login(registerdUser, err => {
            if (err) return next(err)
            req.flash('success', `Welcome to Eat9ja , ${username}`)
            res.redirect('/restaurants')
        })

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    const currentUser = req.user
    const redirectUrl = req.session.returnTo || '/restaurants'
    req.flash('success', `Welcome back, ${currentUser.username}!`)
    res.redirect(redirectUrl)
}
module.exports.logout = (req, res) => {
    const currentUser = req.user
    req.logout(() => {
        req.flash('success', `Goodbye, ${currentUser.username} :( !`)
        res.redirect('/restaurants')
    })
}