var express = require('express');
var router = express.Router();

const Room = require('../models/Meal');

const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner');
const Meal = require('../models/Meal');

// AQUI SE PONEN TODAS LAS RUTAS RELACIONADAS CON MEALS

// ROUTE SEE ALLROOMS
router.get('/', (req, res, next) => {

    Meal.find()
    .populate('owner')
    .then((foundMeals) => {       
        res.render('meals/all-meals.hbs', { meals: foundMeals })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
 
});


// ROUTE CREATE MEAL (GET)

router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('meals/create-meal.hbs')
})

//ROUTE CREATE MEAL(POST)
router.post('/create', isLoggedIn, (req, res, next) => {

    const { name, calories, ingredients,preparation, imageUrl } = req.body

    Meal.create({
        name,
        calories,
        ingredients,
        preparation,
        imageUrl,
         owner: req.session.user._id
    })
    .then((createdMeal) => {
        console.log("Created Meal:", createdMeal)
        res.redirect('/meals')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

//ROUTE SEE DETAILS 
router.get('/details/:mealId', (req, res, next) => {

    Meal.findById(req.params.mealId)
    .populate('owner')
   
    .then((foundMeal) => {
        console.log("Found Meal", foundMeal)
        res.render('meals/meal-details.hbs', foundMeal)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

//ROUTES EDIT MEAL (GET)
router.get('/edit/:mealId', isLoggedIn, isOwner, (req, res, next) => {

    Meal.findById(req.params.mealId)
    .populate('owner')
    .then((foundMeal) => {
        console.log("Found Meal", foundMeal)
        res.render('meals/edit-meal.hbs', foundMeal)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})


//ROUTES EDIT MEAL (POST)
router.post('/edit/:mealId', isLoggedIn, isOwner, (req, res, next) => {

    const {name, calories, ingredients,preparation, imageUrl } = req.body

    Meal.findByIdAndUpdate(
        req.params.mealId,
        {
            name,
            calories,
            ingredients,
            preparation,
            imageUrl,
             owner: req.session.user._id
        },
        {new: true}
    )
    .then((updatedMeal) => {
        res.redirect(`/meals/details/${updatedMeal._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

//ROUTES DELETE MEAL
router.get('/delete/:mealId', isLoggedIn, isOwner, (req, res, next) => {
    
    Meal.findByIdAndDelete(req.params.mealId)
    .then((deletedMeal) => {
        console.log("Deleted meal:", deletedMeal)
        res.redirect('/meals')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})



module.exports = router;

