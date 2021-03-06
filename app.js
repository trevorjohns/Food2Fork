// intialize food2fork api key
const API_KEY = 'f0e79516a7031030448c2c01dd68c95c';

// javascript initialize modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// javascript initialize server
const app = express();

// display engine setup
app.set('view engine', 'ejs');

// intializing express modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// directory of URLS
const directory = ["/", "/recipes", "/recipes.html", "/index.html"];

// function to search for the recipe on food2fork and update the page
function recipeSearch(ingredient, response) {
  // get the url of the food2fork website
  let url = `http://food2fork.com/api/search?q=${ingredient}&key=${API_KEY}`;
  // pass in the url
  request(url, function(error, requestResponse, data) {
    // if error, send message
    if (error)
      response.render('index', {page: null});
    // else if successful
    else {
      // parse the data
      let dataInfo = JSON.parse(data);
      // if the object is not empty
      if (dataInfo != null)
        // print the object
        response.render('index', {page: dataInfo.recipes, error: null});
    }
  });
}

// handle post requests
app.post('/',  (postRequest, postResponse) => {
  // get the ingredient from the request
  let ingredient = postRequest.body.ingredient;
  // search and render
  recipeSearch(ingredient, postResponse);
});

// loop through all possible urls
for(url of directory) {
  // handle get request
  app.get(url, (getRequest, getResponse) => {
    // get in the ingredient from the URL parameter
    let ingredient = getRequest.query.ingredients;
    // get the url of the food2fork website
    recipeSearch(ingredient, getResponse);
  });
}

// open server
app.listen(3000, () => {
  console.log('Food2Fork Search Engine listening on port 3000!');
});
