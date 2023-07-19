const Meal = require('../models/Meal')


const isOwner = (req, res, next) => {

    Meal.findById(req.params.mealId)
    .populate('owner')
    .then((foundMeal) => {
        if(foundMeal.owner._id.toString() === req.session.user._id) {
            next()
        } else {
            res.redirect('/meals')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}

module.exports = isOwner