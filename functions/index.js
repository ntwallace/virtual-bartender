const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const app = dialogflow();

const drinks = require('./recipes.json');
let liquor;
let type;
let finalDrink;

app.intent('Default Welcome Intent', conv => {
  conv.ask("Hey there, welcome to the virtual bar. I'm Jack, your bartender.");
});

app.intent('get day', (conv, params) => {
  conv.ask(`Nice to meet you ${params.name}, how's your day going?`);
});

app.intent('day', (conv) => {
    let daySentiment = sentiment.analyze(conv.query);
    let response;
    
    if (daySentiment.score < -2) {
        response = "<speak> Rough <break time='1s' /> First one is on the house. " ;
    } else if (daySentiment.score >= -2 && daySentiment.score < 2) {
        response = "<speak>Right on. <break time='1s' /> How about a drink? ";
    } else {
        response = "<speak>Great! <break time='1s' /> Let's get you a drink! ";
    }
    
 	conv.data.firstResponse = response;
  	conv.ask(response + "What kind of liquor do you like?</speak>");
});

app.intent('get liquor', (conv, params) => {
  conv.data.liquor = params.liquor;
  liquor = conv.data.liquor;

  conv.ask(
    `Okay, ${ conv.data.liquor }, it is. Do you prefer a shaken or stirred drink?`
  );
});

app.intent('get type', (conv, params) => {
  drinkType = params.type;
  conv.data.type = params.type;

  conv.ask("Awesome, I'm gonna whip you up something great! Ready?");
});

function getLiquor() {
	let liquorResults = [];
	drinks.filter(function(drink){
		drink.ingredients.forEach(function(element) {
	    	if (element.ingredient == liquor) liquorResults.push(drink);
	    });         
	});

	return liquorResults;
}

function getDrink(liquorArray, type) {
	let finalDrink;

	// liquorArray = array of obj with all drinks that have user specified liquor
	if (type.toLowerCase() === 'shaken') {
		let shakenDrinks = liquorArray.filter(function(drink){
			return drink.preparation.includes("Shake");      
		});
		let randomIndex = getRandomInt(0, shakenDrinks.length);
		finalDrink = shakenDrinks[randomIndex];

	} else if (type.toLowerCase() === 'stirred') {
		let stirredDrinks = liquorArray.filter(function(drink){
			return drink.preparation.includes("Stir") || drink.preparation.includes("muddle");       
		});
		let randomIndex = getRandomInt(0, stirredDrinks.length);
		finalDrink = stirredDrinks[randomIndex];

	} else {
		let randomIndex = getRandomInt(0, liquorArray.length);
		finalDrink = liquorArray[randomIndex];

	}
  
  return finalDrink;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

app.intent('get drink', (conv, params) => {

  let liquorOptions = getLiquor();
  finalDrink = getDrink(liquorOptions, drinkType);
  let drinkIngredients = [];
  let makeDrink = [];

  conv.data.drink = finalDrink.name;
  
  finalDrink.ingredients.forEach(function(e) {
  	drinkIngredients.push(e.ingredient);
  });

  conv.data.drinkIngredients = drinkIngredients.join(', ');

  conv.ask(
    `Alright, I'm gonna make you a ${ conv.data.drink }! It's ${ conv.data.drinkIngredients }. Sound good?`
  );
});

app.intent('drinkResponse', (conv) => {
  const drinkSentiment = sentiment.analyze(conv.query);
  let response;

  if (drinkSentiment.score < 1.5) {
        conv.ask('Ok, would you like me to make you something else?');
  } else {
      let makeDrink = [];

      finalDrink.ingredients.forEach(function(e) {
        if (e.amount) makeDrink.push(e.amount + e.unit + " " + e.ingredient);
        if (e.special) makeDrink.push(e.special);
      });

      let shakenAudio = 'https://archive.org/download/testmp3testfile/mpthreetest.mp3';
      let stirredAudio = 'https://archive.org/download/testmp3testfile/mpthreetest.mp3';
      let drinkSoundUrl;

      if(drinkType.toLowerCase() === 'shaken') {
        drinkSoundUrl = shakenAudio;
      } else {
        drinkSoundUrl = stirredAudio;
      }

      conv.close("<speak><audio src='" + drinkSoundUrl + "'>didn't get audio</audio><break time='2' /> Here you go! So, the ingredients are: <say-as interpret-as='unit'>" + makeDrink + ".</say-as> To make the drink, " + finalDrink.preparation + "<break time='2s' /> Cheers!</speak>");
  }
});

app.intent('drink-yes', (conv) => {
    conv.ask(`No problem, what kind of liquor do you want?`);
});

app.intent('drink-no', (conv) => {
    conv.close('<speak>Fine, get the <emphasis level="strong">hell</emphasis> out of my bar!</speak>');
});

exports.bartender = functions.https.onRequest(app);