const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const MainRoutesSchema = new mongoose.Schema({
    addressA: {
        type: String,
        required: [true, 'Please Add an address']
    },
    locationA: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String
    },
    addressB: {
        type: String,
        required: [true, 'Please Add an address']
    },
    locationB: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String
    },
    locationHalfWay: {
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
    },
    id: {
      type: String,
      unique: true,

    },
    //typeOfPlace: String,
    /*user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },*/
    createdAt:{
        type: Date,
        default: Date.now
    }
})

// Geocode and create location

MainRoutesSchema.pre('save', async function(next){
    const locA = await geocoder.geocode(this.addressA)
    const locB = await geocoder.geocode(this.addressB)
    this.locationA = {
        type: 'Point',
        coordinates: [locA[0].longitude, locA[0].latitude],
        formattedAddress : locA[0].formattedAddress
    }
    this.locationB = {
        type: 'Point',
        coordinates: [locB[0].longitude, locB[0].latitude],
        formattedAddress : locB[0].formattedAddress
    }

    // Do not save entered Address 
    this.addressA = undefined
    this.addressB = undefined
    next()
})

module.exports = mongoose.model('MapRoute', MainRoutesSchema)