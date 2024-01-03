"use strict"

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', '/particlesjs-config.json', function () {
    console.log('callback - particles.js config loaded');
});

// submit event to register new user.
document.getElementById('newUserForm').addEventListener('submit', signUpNewUser());

//sign up new user using API.
function signUpNewUser() {
    // handling form submission.
    document.getElementById('newUserForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // fetch data using POST request to register new user in API.
        // http://microbloglite.us-east-2.elasticbeanstalk.com/docs/#/Users/createUser
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            //getting input from sign up form fields.
            "username": document.getElementById('username').value,
            "fullName": document.getElementById('fullName').value,
            //TODO when registering new user, eventually may add more input fields such as bio prompt.
            // "bio": document.getElementById('bio').value,
            "password": document.getElementById('password').value

        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", requestOptions)
            .then(response => response.json())
            // display alert that new user has been created.
            .then(result => {
                console.log(result);
                if (result.statusCode == 409) {
                    alert('User already exist. Please choose different username.');
                }
                else
                    window.location.replace('/index.html')
            }

            )
            .catch(error => console.log('error'));

    })
}