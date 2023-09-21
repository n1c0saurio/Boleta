// 
// Dashboard scripts


// Show navigation menu if screen size is medium or more
if (window.screen.width >= 768) {
  let headerContent = document.getElementById('dashboard__header-content');
  if (headerContent) {
    headerContent.classList.add('show');
  }
}

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

function priceFormating(inputElement) {
  // Value must be converted to the minimum unit of the currency,
  // to do so, use the 'currency.exponent' property of the
  // object version of the currency.
  // This means:
  // a. Import @dinero.js/currencies to this script, or
  // b. Send the actual currency object from URL handler (preferred)

  let value = priceCleanning(inputElement.value); // TODO: convert to decimal with dinero.js
  

  const formatter = Intl.NumberFormat(
    'es-CL', // TODO: Get locale from: user profile or browser (preferred)
    {
      style: 'currency',
      currency: 'CLP' // TODO: Get currency from: users `defaultCurrency` or lists `currency` (implement) 
    }
  );
  // This function will return the value formatted to the input,
  // that means when the form is submitted, it needs to be sanitized again:
  // a. On this function itself,
  // b. On the corresponding validator method, or
  // c. In both places
  inputElement.value = formatter.format(value);
}

function submitCleannig(formElement) {
  let inputPrice = formElement['itemPrice'];
  inputPrice.value = priceCleanning(inputPrice.value);
}
