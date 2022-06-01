const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const { validateRestaurant, isLoggedIn, isAuthor } = require('../middleware')
const restaurants = require('../controllers/restaurants')
const multer = require('multer') //for file uploads
const { storage } = require('../cloudinary') //node automatically looks for an index folder so no need to specify /index
const upload = multer({ storage })



router.route('/')
    .get(restaurants.getIndex)
    .post(isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createRestaurant))



router.get('/new', isLoggedIn, restaurants.renderNewForm)



router.route('/:id')
    .get(catchAsync(restaurants.showRestaurants))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRestaurant, catchAsync(restaurants.editRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm))


module.exports = router
