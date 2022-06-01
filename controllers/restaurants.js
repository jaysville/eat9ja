const Restaurant = require('../models/restaurant')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })

const { cloudinary } = require('../cloudinary')

module.exports.getIndex = async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
}
module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new')
}
module.exports.createRestaurant = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()
    const restaurant = new Restaurant(req.body.restaurant)
    restaurant.geometry = geoData.body.features[0].geometry
    restaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    restaurant.author = req.user._id
    await restaurant.save()
    console.log(restaurant)
    req.flash('success', 'Successfully added Restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`)
}
module.exports.showRestaurants = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    //
    if (!restaurant) {
        req.flash('error', 'Cannot find restaurant!')
        return res.redirect('/restaurants')
    }
    res.render('restaurants/show', { restaurant })
}
module.exports.renderEditForm = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/edit', { restaurant })
}
module.exports.editRestaurant = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    restaurant.images.push(...imgs)

    await restaurant.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await restaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(restaurant)
    }

    req.flash('success', 'Restaurant Updated!')
    res.redirect(`/restaurants/${restaurant._id}`)
}
module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params
    await Restaurant.findByIdAndDelete(id)
    req.flash('success', 'Restaurant deleted!')
    res.redirect('/restaurants')
}