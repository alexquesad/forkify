import View from './View.js';
import PreviewView from './previewView.js';

import icons from 'url:../../img/icons.svg';

class BookmarkView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No bookmarks yet. Find a nice recipe and save it :)";
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return (this._data.map(result => PreviewView.render(result, false)).join(''))
    }
}

export default new BookmarkView();