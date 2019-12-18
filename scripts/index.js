const guideList = document.querySelector('.guides');
const loggedInLinks = document.querySelectorAll('.logged-out');
const loggedOutLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

// Set up UI - How it's shown to logged in/out is in auth.js
const setUpUI = user => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = 'block'));
    }
    // Get user info
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        // Show account info (email & bio)
        const html = `
          <div>Logged in as ${user.email}</div>
          <div>${doc.data().bio}</div>
          <div class="red-text">${user.admin ? 'Admin' : ''}</div>
          `;
        accountDetails.innerHTML = html;
      });

    // Toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = 'none'));
    loggedOutLinks.forEach(item => (item.style.display = 'block'));
  } else {
    // Hide admin items
    adminItems.forEach(item => (item.style.display = 'none'));
    // Hide account info
    accountDetails.innerHTML = 'Please log in to view account details.';
    // Toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = 'block'));
    loggedOutLinks.forEach(item => (item.style.display = 'none'));
    // Clear create guide modal
    guideList.innerHTML = '';
  }
};

// Set up the guides - How it's shown to logged in/out is in auth.js
const setUpGuides = data => {
  // If data is available (logged in)
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const title = guide.title;
      const content = guide.content;
      const li = `
      <li>
        <div class="collapsible-header grey lighten-4">${title}</div>
        <div class="collapsible-body white">
          <span>${content}</span>
        </div>
      </li>
      `;
      html += li;
    });

    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h5 class="center-aligned">Login or sign up to view guides</h5>`;
  }
};

// Set up Materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});
