import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

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
    resultsView.render(model.state.search.results);
  }
  catch(err){
    console.log(err);
  }

}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}
init();
