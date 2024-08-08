import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

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

    //Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookmarks);
    
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

const controlAddBookmark = function(){
  if (!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);  
  }
  else {
    model.deleteBookmark(model.state.recipe.id);  
  }
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
  }
  catch (err){
    console.log(err);
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

}
init();
