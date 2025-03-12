export default function decorate(blockElement) {
  const titleDescriptionDiv = document.createElement('div');
  titleDescriptionDiv.className = 'title-description-container-footer';

  [...blockElement.children].forEach((rowElement) => {
    if (rowElement.dataset.aueModel === 'title-description') {
      titleDescriptionDiv.append(rowElement);
    }
  });
}
