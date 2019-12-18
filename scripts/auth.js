// Add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  // Referencing addAdminRole in functions/index.js
  const addAdminRole = functions.httpsCallable('addAdminRole');
  // Sends to data.email in functions/index.js
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

// Listen for auth status changes
auth.onAuthStateChanged(user => {
  console.log(user);

  // If logged in, do these things
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setUpUI(user);
    });
    // Get guides data in real time
    db.collection('guides').onSnapshot(
      snapshot => {
        setUpGuides(snapshot.docs);
      },
      err => {
        console.log(err.message);
      }
    );
    // If logged out, do these things
  } else {
    setUpUI();
    setUpGuides([]);
  }
});

// Create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e => {
  e.preventDefault();
  // Add title and content to firestore
  db.collection('guides')
    .add({
      title: createForm['title'].value,
      content: createForm['content'].value
    })
    .then(() => {
      // Close the modal and reset form
      const modal = document.querySelector('#modal-create');
      // Close modal
      M.Modal.getInstance(modal).close();
      // Clear the form fields (normal JS)
      createForm.reset();
    })
    .catch(err => {
      alert('Please log in to post a guide.');
    });
});

// Sign Up
const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info
  let email = signUpForm['signup-email'].value;
  let password = signUpForm['signup-password'].value;

  // Sign up the user (this is asyncronous (takes time to complete)). cred is user credentials
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // Save user's information to firestore.
      // Using return to add the 'then()' at the end of signUpForm.addEventListener()
      return db
        .collection('users')
        .doc(cred.user.uid)
        .set({
          bio: signUpForm['signup-bio'].value
        });
    })
    .then(() => {
      const modal = document.querySelector('#modal-signup');
      // Close modal
      M.Modal.getInstance(modal).close();
      // Clear the form fields (normal JS)
      signUpForm.reset();
      signUpForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      signUpForm.querySelector('.error').innerHTML = err.message;
    });
});

// Log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
  e.preventDefault();

  auth.signOut();
});

// Log in
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info
  let email = loginForm['login-email'].value;
  let password = loginForm['login-password'].value;

  // Log user in
  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      const modal = document.querySelector('#modal-login');
      // Close modal
      M.Modal.getInstance(modal).close();
      // Clear the form fields (normal JS)
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
    });
});
