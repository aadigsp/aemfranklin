import { sortController, headlessResultsList } from '../controller/controllers.js';
import renderSearchResults from './renderSearchResult.js';

export function sortByTitle(data) {
  return [...data].sort((a, b) => a.title.localeCompare(b.title));
}
export function sortByDateDescending(data) {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.indexeddate);
    const dateB = new Date(b.indexeddate);
    return dateB - dateA;
  });
}
export const sortCondition = {
  sortBy: (criterion) => {
    const values = headlessResultsList.state.results;
    if (criterion.by === 'field' && criterion.field === 'title') {
      // Sorting by Title
      return sortByTitle(values);
    } if (criterion.by === 'indexeddate') {
      // Sorting by Date Ascending
      return sortByDateDescending(values);
    } if (criterion.by === 'relevancy') {
      return sortController.sortBy(criterion);
    }
    return '';
  },
};
const renderSorting = () => {
  const sortElement = document.getElementById('sort');
  sortElement.innerHTML = '';
  const sortOptions = [
    { label: 'Relevancy', criterion: { by: 'relevancy' } },
    { label: 'Title', criterion: { by: 'field', field: 'title' } },
    { label: 'Date', criterion: { by: 'indexeddate', field: 'indexeddate' } },
  ];
  const selectElement = document.createElement('select');
  selectElement.id = 'sort-element';
  selectElement.className = 'tw-py-2 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-text-sm';
  sortOptions.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = JSON.stringify(option.criterion);
    optionElement.innerText = option.label;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener('change', () => {
    // const selectedCriterion = JSON.parse(event.target.value);
    // const sortedData = sortCondition.sortBy(selectedCriterion);
    renderSearchResults();
  });
  sortElement.appendChild(selectElement);
};
export default renderSorting;
