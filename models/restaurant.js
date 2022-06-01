const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
imageSchema.virtual('samesize').get(function () {
    return this.url.replace('upload', '/upload/w_500,h_350')
})

const opts = { toJSON: { virtuals: true } }

const restaurantSchema = new Schema({
    title: String,
    description: String,
    location: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

restaurantSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<strong><a href="/restaurants/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}.....</p>`
})
restaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)