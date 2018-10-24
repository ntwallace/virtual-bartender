let drinks = [
	{ "name": "Vesper",
    "glass": "martini",
    "category": "Before Dinner Cocktail",
    "ingredients": [
      { "unit": "cl",
        "amount": 6,
        "ingredient": "Gin" },
      { "unit": "cl",
        "amount": 1.5,
        "ingredient": "Vodka" },
      { "unit": "cl",
        "amount": 0.75,
        "ingredient": "Lillet Blonde" }
    ],
    "garnish": "Lemon twist",
    "preparation": "Shake and strain into a chilled cocktail glass." },
  { "name": "Bacardi",
    "glass": "martini",
    "category": "Before Dinner Cocktail",
    "ingredients": [
      { "unit": "cl",
        "amount": 4.5,
        "ingredient": "White rum",
        "label": "Bacardi White Rum" },
      { "unit": "cl",
        "amount": 2,
        "ingredient": "Lime juice" },
      { "unit": "cl",
        "amount": 1,
        "ingredient": "Syrup",
        "label": "Grenadine" }
    ],
    "preparation": "Shake with ice cubes. Strain into chilled cocktail glass." },
  { "name": "Negroni",
    "glass": "old-fashioned",
    "category": "Before Dinner Cocktail",
    "ingredients": [
      { "unit": "cl",
        "amount": 3,
        "ingredient": "Gin" },
      { "unit": "cl",
        "amount": 3,
        "ingredient": "Campari" },
      { "unit": "cl",
        "amount": 3,
        "ingredient": "Vermouth",
        "label": "Sweet red vermouth" }
    ],
    "garnish": "Half an orange slice",
    "preparation": "Build into old-fashioned glass filled with ice. Stir gently." }
]

let liquor = 'Gin';

function getLiquor() {
	let liquorResults = [];
	drinks.filter(function(drink){
		drink.ingredients.forEach(function(element) {
	    	if (element.ingredient === liquor) liquorResults.push(drink);
	    });         
	});

	return liquorResults;
}

function getDrink(liquorArray, type) {
	let finalDrink;

	let drinkResult = liquorArray.filter(function (drink) {

		if (type === 'Shaken') {
			let shakenDrinks = drinks.filter(function(drink){
    			return drink.preparation.includes("Shake") || drink.preparation.includes("Shaken");       
			});

			let randomIndex = getRandomInt(0, shakenDrinks.length);
			finalDrink = shakenDrinks[randomIndex];
		} else if (type === 'Stirred') {
			let stirredDrinks = drinks.filter(function(drink){
    			return drink.preparation.includes("Stir") || drink.preparation.includes("Stirred");       
			});
			let randomIndex = getRandomInt(0, stirredDrinks.length);
			finalDrink = stirredDrinks[randomIndex];

		} else {
			let randomIndex = getRandomInt(0, liquorArray.length);
			finalDrink = drink[randomIndex];

		}
	});
  
  return finalDrink;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

let liquorOptions = getLiquor();
let finalDrink = getDrink(liquorOptions, 'Stirred');
let drinkIngredients = [];

let drink = finalDrink['name'];

finalDrink.ingredients.forEach( function(e) {
	drinkIngredients.push(e.ingredient);
});

console.log(drink, drinkIngredients);