"use strict";
window.onload = init;
const username = JSON.parse(localStorage.getItem('login-data')).username;
function init(event) {
    event.preventDefault();
    // const username = userLogin.username;
    console.log(username);
    // getUser(username);
    getUserData(username);
    greetUser(username);
    

}
const display = document.getElementById("user-interface");
const editForm = document.getElementById("edit-user-data");
const token = JSON.parse(window.localStorage.getItem("login-data")).token;

// function to get user data
async function getUserData(endpointResource) {
    const baseUrl = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/";
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    if (!endpointResource) {
        console.error(`User has not logged in`);
        return;
    }
    try {
        const response = await fetch(baseUrl + endpointResource, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Network response was not okay`);
        }
        const data = await response.json()
        // replace with another function later
        console.log(data);
        bio.innerText = `bio: ${data.bio}`;

        // greetUser(data);
    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
}

function greetUser(user) {
    document.getElementById("greeting").innerText = `Welcome ${user}`;
}

// let user edit profile

// user can edit bio
function edit() {
   display.innerHTML = `
   <div id="edit-user-data" class="container">
                    <form action="submit">
                        <div>
                            <label for="edit-bio" class="form-label">Edit Bio</label>
                            <textarea id="edit-bio" class="form-control" rows="3"></textarea>
                        </div>
                    </form>
                </div>
   `;
}

// user can add profile
function setProfileImg() {

}

// when post button is clicked get all usr post
async function getPost() {
    let baseUrl = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=10&offset=0&username=";
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    if (!baseUrl) {
        console.error(`User has not logged in`);
        return;
    }
    try {
        const response = await fetch(baseUrl + username, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Network response was not okay`);
        }
        const data = await response.json()
        // replace with another function later
        console.log(data);
        displayPost(data);

        // greetUser(data);
    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
}

// display user post
function displayPost(_data) { 
    let postCard = "";
    _data.forEach(post => {
        postCard += `
        <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">${post.username}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary"></h6>
            <p class="card-text">${post.text}</p>
        </div>
        </div>
        `
    });
    display.innerHTML = postCard;
    console.log(_data);
}

// display user buddies
function displayBuddies() {

}

// display user images
function displayUserImages() {

}

// display user likes
function displayLikedPosts() {

}

// display users favorite topics
function displayTopics() {

}


