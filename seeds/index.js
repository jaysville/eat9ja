const mongoose = require('mongoose')
const Restaurant = require('../models/restaurant')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/eatnaija', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database Connected')
})


const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDb = async () => {
    await Restaurant.deleteMany({})
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 1
        const restaurant = new Restaurant({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city} , ${cities[random1000].state} `,
            author: '6289db929225cdbd4560107f',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtvitkoxo/image/upload/v1653309088/Eatnaija/diiupfoep27pjd2xubp7.jpg',
                    filename: 'Eatnaija/diiupfoep27pjd2xubp7',

                }
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt quidem repellendus illo! Neque, sequi dicta aliquid voluptas natus perspiciatis eum, architecto nihil in veritatis labore rerum rem deleniti totam accusamus?',
            price
        })
        await restaurant.save()

    }

}

seedDb().then(() => {
    mongoose.connection.close()
})