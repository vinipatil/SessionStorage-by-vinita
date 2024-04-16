document.addEventListener('DOMContentLoaded', function() {
    var registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var fullName = document.getElementById('fullName').value;
            var email = document.getElementById('email').value;
            var mobile = document.getElementById('mobile').value;
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match");
                return;
            }

            if (sessionStorage.getItem(email)) {
                alert("User already exists with this email");
                return;
            }

            var user = {
                fullName: fullName,
                email: email,
                mobile: mobile,
                password: password
            };

            sessionStorage.setItem(email, JSON.stringify(user));
            alert("Registration successful");
            window.location.href = "login.html";
        });
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var loginEmail = document.getElementById('loginEmail').value;
            var loginPassword = document.getElementById('loginPassword').value;
            var user = JSON.parse(sessionStorage.getItem(loginEmail));

            if (user && user.password === loginPassword) {
                alert("Login successful");
                window.location.href = "dashboard.html";
            } else {
                alert("User does not exist or invalid credentials");
            }
        });
    }

    //to add data in the dashboard table
    var userTable = document.getElementById('userTable');
    if (userTable) {
        for (var i = 0; i < sessionStorage.length; i++) {
            var key = sessionStorage.key(i);
            var userData = sessionStorage.getItem(key);
            var user = JSON.parse(userData);
            if (user && user.fullName && user.email && user.mobile) {
                addUserToTable(user);
            } else {
                console.error("Invalid user data:", user);
            }
        }
    }
});

function addUserToTable(user) {
    var userTable = document.getElementById('userTable');
    if (!userTable) return;

    var row = document.createElement('tr');
    row.setAttribute('data-email', user.email);
    row.innerHTML = `
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td class="action-buttons">
        <button onclick="editUser('${user.email}')">Update</button>
        <button onclick="deleteUser('${user.email}')">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
}

function editUser(email) {
    var user = JSON.parse(sessionStorage.getItem(email));
    if (!user) return;

    var newFullName = prompt("Enter new full name", user.fullName);
    var newEmail = prompt("Enter new email", user.email);
    var newMobile = prompt("Enter new mobile number", user.mobile);
    if (newFullName !== null && newEmail !== null && newMobile !== null) {
        user.fullName = newFullName;
        user.email = newEmail;
        user.mobile = newMobile;
        sessionStorage.setItem(email, JSON.stringify(user));
        location.reload();
    }
}

function deleteUser(email) {
    if (confirm("Are you sure you want to delete this user?")) {
        sessionStorage.removeItem(email);
        
        var row = document.querySelector(`tr[data-email="${email}"]`);
        if (row) {
            row.remove();
        }
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}
