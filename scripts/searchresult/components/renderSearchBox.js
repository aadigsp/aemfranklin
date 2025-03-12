import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
  const queryInput = document.getElementById('coveo-query');
  const suggestionPopup = document.getElementById('suggestion-popup');
  const coveoResults = document.getElementById('coveo-results');
  const searchTermValue = document.getElementById('searchTermValue');
  const searchTermContainer = document.getElementById('searchTermContainer');
  const clearSearch = document.getElementById('clear-search');
  searchTermContainer.style.display = 'none';
  clearSearch.style.display = 'none';

  const showSuggestions = () => {
    const searchBox = document.getElementById('coveo-query');
    const suggestions = searchBoxController.state.suggestions || [];

    const rect = searchBox.getBoundingClientRect();
    suggestionPopup.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionPopup.style.left = `${rect.left + window.scrollX}px`;

    if (suggestions.length > 0) {
      suggestionPopup.innerHTML = suggestions
        .map((suggestion) => `<div class="suggestion-item" style="padding: 8px; cursor: pointer;" data-raw-value="${suggestion.rawValue}">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0065 7.33324C12.0065 9.7264 10.0664 11.6665 7.67318 11.6665C5.27993 11.6665 3.33984 9.7264 3.33984 7.33324C3.33984 4.94007 5.27993 3 7.67318 3C10.0664 3 12.0065 4.94007 12.0065 7.33324ZM11.0743 11.4414C10.1512 12.2066 8.96589 12.6665 7.67318 12.6665C4.72766 12.6665 2.33984 10.2787 2.33984 7.33324C2.33984 4.38777 4.72766 2 7.67318 2C10.6187 2 13.0065 4.38777 13.0065 7.33324C13.0065 8.62593 12.5466 9.81119 11.7815 10.7343L14.0267 12.9796L14.3803 13.3331L13.6732 14.0402L13.3196 13.6867L11.0743 11.4414Z" fill="#707070"/>
            </svg>
            ${suggestion.highlightedValue}
          </div>`)
        .join('');
      suggestionPopup.style.display = 'block';
    } else {
      suggestionPopup.style.display = 'none';
    }
  };

  const showResults = () => {
    coveoResults.style.display = 'block';
    suggestionPopup.style.display = 'none';
    coveoResults.innerHTML = '<h3>Search Results go here...</h3>';
  };

  queryInput.addEventListener('input', (event) => {
    sessionStorage.removeItem('focusedElement');
    const query = event.target.value;
    if (query.length > 0) {
      searchBoxController.updateText(query);
      searchBoxController.showSuggestions();
      showSuggestions();
      clearSearch.style.display = 'block';
    } else {
      searchBoxController.updateText('');
      suggestionPopup.style.display = 'none';
      clearSearch.style.display = 'none';
    }
  });

  queryInput.addEventListener('input', () => {
    if (searchBoxController.state.value === '') {
      searchBoxController.clear();
      searchBoxController.submit();
    }
  });

  queryInput.addEventListener('keydown', (event) => {
    searchTermValue.innerHTML = '';
    searchTermValue.innerHTML = event.target.value;
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      searchTermContainer.style.display = 'block';
      searchBoxController.submit();
      showResults();
    }
    if (event.key === 'Backspace') {
      searchTermContainer.style.display = 'none';
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.querySelector('.coveo-search-component').contains(event.target)) {
      suggestionPopup.style.display = 'none';
    }
  });

  clearSearch.addEventListener('click', () => {
    queryInput.value = '';
    searchTermContainer.style.display = 'none';
    searchBoxController.clear();
    searchBoxController.submit();
    clearSearch.style.display = 'none';
  });
};
export default renderSearchBox;
