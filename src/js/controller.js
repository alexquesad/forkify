import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot)
  module.hot.accept();

const controlRecipes = async function (){
  try {
    const id = window.location.hash.slice(1);
    if (!id)
      return;
    recipeView.renderSpinner();

    //loading recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeView.render(model.state.recipe);

  }
  catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query)
      return;
    await model.loadSearchResults(query);
    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  }
  catch(err){
    console.log(err);
  }

}

const controlPagination = function (goToPage){
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render initial pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();
