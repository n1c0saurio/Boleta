// 
// Dashboard scripts

// 
// Navigation

// Set navigation menu visible by default if screen size is medium or more
if (window.screen.width >= 768) {
  const sidebar = document.getElementById('dashboard__header-content');
  const sidebarToggle = document.getElementById('dashboard__header-toggle');

  sidebar.classList.add('show');
  switchNavigation(sidebarToggle.children[0]);
}

// Switch icon of navigation's toggle when clicked
function switchNavigation(childElement) {
  // Set a delay to give the `DOM` time to be updated 
  setTimeout(() => {
    const dashboardContent = document.getElementById('dashboard__content');
    const navStatus = document.getElementById('dashboard__header-content')
      .classList.contains('show');

    if (navStatus) {
      childElement.classList.add('dashboard__header-toggle--open');
      dashboardContent.classList.add('nav-open');
    } else {
      childElement.classList.remove('dashboard__header-toggle--open');
      dashboardContent.classList.remove('nav-open');
    }
  }, 400);
}

// 
// Add item form

// Prevent unwanted characters on `itemPrice` input
function forbiddenChars(event) {
  // TODO: format this in a better way
  const allowedKeys = /[0-9]|Enter|Tab|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|PageUp|PageDown/;
  // Filter unallowed characters
  if (!allowedKeys.test(event.key) &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey &&
    !event.metaKey
  ) {
    event.preventDefault();
  }
}

function priceCleanning(price) {
  return price.replace(/[^0-9]/g, '');
}

function priceFormating(inputElement, currency, locale) {
  let value = priceCleanning(inputElement.value);

  if (value) {
    value = parseInt(value) / (10 ** currency.exponent);
    const formatter = Intl.NumberFormat(
      locale,
      {
        style: 'currency',
        currency: currency.code
      }
    );
    inputElement.value = formatter.format(value);
  }
}

function submitCleannig(formElement) {
  let inputPrice = formElement['itemPrice'];
  inputPrice.value = priceCleanning(inputPrice.value);
}
