const MapRoute = require('../models/Map_Route')


module.exports = {

    // @route /
    getIndex:(req,res) =>{
        
        res.render('index')
    },

    // @routes /halfwayroutes/:id
    getHalfwayroutes: async (req,res,next) => {
        try {
            const route = await MapRoute.find({id : req.params.id})
            //console.log(route[0].locationB.formattedAddress)
            res.render('map_routes',{ 
                addressA : route[0].locationA.formattedAddress,
                addressB: route[0].locationB.formattedAddress,
                id : req.params.id
                 })
        }catch (error) {
        console.error(error)
        res.status(500).json({error: 'Server error'})
        }
    },

    //:id/halfways
    getHalfway: async (req,res, next) => {
        try {
            const routes = await MapRoute.find({id : req.params.id})
            return res.status(200).json({
                success: true,
                count: routes.length,
                data: routes
              });
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'Server error'})
        }
    },
    addHalfway: async (req,res, next) => {
        try {
            //console.log(req.body.addressA)
            const ID = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
            const route = await MapRoute.create({
                addressA: req.body.addressA,
                addressB: req.body.addressB,
                id : ID,
            })
            
            res.redirect(`/halfwayroutes/${ID}`)
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }


}   
