/* Landing Page JavaScript */

"use strict";

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'particlesjs-config.json', function () {
    console.log('callback - particles.js config loaded');
});

const loginForm = document.querySelector("#login");

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: loginForm.username.value,
        password: loginForm.password.value,
    }

    // Disables the button after the form has been submitted already:
    // loginForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    login(loginData);
};


function showPassword(){
    // grab password to make it visible when user checks the box.
    let password = document.getElementById('password');
    if(password.type === "password"){
        password.type = "text";
    }
    else{
        password.type = "password";
    }
}