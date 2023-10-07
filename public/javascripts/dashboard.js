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
