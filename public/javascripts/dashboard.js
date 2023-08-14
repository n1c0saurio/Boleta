// 
// Dashboard scripts

// Show navigation menu if screen size is medium or more
if (window.screen.width >= 768) {
  let headerContent = document.getElementById('dashboard__header-content');
  if (headerContent) {
    headerContent.classList.add('show');
  }
}