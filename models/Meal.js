const { Schema, model } = require('mongoose');

const mealSchema = new Schema({
    name: String,
    calories: Number,
    ingredients: String,
    preparation: String,
    imageUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
 
  });

module.exports = model('Meal', mealSchema);