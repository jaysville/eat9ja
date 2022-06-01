const Restaurant = require("./models/restaurant")
const Review = require('./models/review')
const { restaurantSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utilities/ExpressError')

module.exports.validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }

}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!')
        return res.redirect(`/restaurants/${id}`)
    }
    next()
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!')
        return res.redirect(`/restaurants/${id}`)
    }
    next()
}