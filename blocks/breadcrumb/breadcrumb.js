import { createElement } from '../../scripts/scripts.js';

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title').innerText;
  }
  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');

  let prevPath = '';
  const fetchPromises = [];

  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    prevPath = `${prevPath}/${pathPart}`;
    const path = `${prevPath}.html`;
    const url = `${window.location.origin}${path}`;

    // Push the promise to the array
    fetchPromises.push(
      getPageTitle(url).then((name) => {
        if (name) {
          result.push({ path, name, url });
        }
      }),
    );
  }

  await Promise.all(fetchPromises);

  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  if (path.name === 'Home') {
    pathLink.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="16/home"><path id="Vector 568" d="M3.33398 13V5.66667L8.00065 2L12.6673 5.66667V13H9.33398V8.66667H6.66732V13H3.33398Z" stroke="#707070"/></g></svg>';
  } else {
    pathLink.innerText = path.name;
  }
  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';

  const HomeLink = createLink({
    path: '',
    name: 'Home',
    url: window.location.origin,
  });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path);

    paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));

    const currentPath = document.createElement('span');
    currentPath.innerText = document.querySelector('title').innerText;
    currentPath.style.fontWeight = 'bold';
    currentPath.style.color = 'black';
    breadcrumbLinks.push(currentPath.outerHTML);

    const separator = '<span class="breadcrumb-separator"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="16/chevron-right"><path id="Vector 118" d="M3.75 10.5L8.25 6L3.75 1.5" stroke="#707070"/></g></svg></span>';

    breadcrumb.innerHTML = breadcrumbLinks.join(separator);
    block.append(breadcrumb);
  }, 1000);
}
