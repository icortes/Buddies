"use strict";
window.onload = init;
function init(event) {
    event.preventDefault();
    document.getElementById('title').innerText = `${username}'s Profile (test)`;
    console.log(username);
    getUserData(username);
    greetUser(username);
}
const username = JSON.parse(localStorage.getItem('login-data')).username;
const display = document.getElementById("user-display");
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
        // add functions or update inneer html or text here
        console.log(data);
        bio.innerText = `bio: ${data.bio}`;

    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
}

function greetUser(user) {
    document.getElementById("greeting").innerText = `Welcome ${user}`;
}

// edit profile form
function edit() {
    display.innerHTML = `
   <div id="edit-user-data" class="container">
        <form id="update-bio-form">
            <div>
                <label for="edit-bio" class="form-label">Edit Bio</label>
                <textarea id="edit-bio" class="form-control" rows="3"></textarea>
            </div>
            <button class="btn btn-primary" id="updateBioBtn" onclick="editBio(event)">Update</button>
        </form>
    </div>
   `;
}

// edit user bio
function editBio(event) {
    event.preventDefault();
    const updatedBio = document.getElementById("edit-bio").value;
    let newBio = {
        bio: updatedBio,
    };

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/" + username, {
        method: 'PUT',
        body: JSON.stringify(newBio),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            bio.innerText = `bio: ${data.bio}`;
            display.innerText = `Bio has been updated!`;
        })
        .catch(err => {
            alert(`error ${err}`)
        });

}

// when post button is clicked get all of this user's post
async function getPost() {
    const baseUrl = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=10&offset=0&username=";
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
    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
}

//  new post form
function newPostForm(){
    display.innerHTML = `
    <div id="edit-user-data" class="container">
         <form id="update-bio-form">
             <div>
                 <label for="post-text" class="form-label">Make a New Post</label>
                 <textarea id="post-text" class="form-control" rows="3"></textarea>
             </div>
             <button class="btn btn-primary" id="post-btn" onclick="newPost(event)">Post</button>
         </form>
     </div>
    `;
}

// post the new post
function newPost(event) {
    event.preventDefault();
    const postText = document.getElementById("post-text").value;
    const myNewPost = {
        text: postText
    };

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
        method: 'POST',
        body: JSON.stringify(myNewPost),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            display.innerHTML = `Posted!`;
        })
        .catch(err => {
            alert(`error ${err}`)
        });

}

// display logged in user's post
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
    display.innerHTML = `
    <button class="btn btn-primary" onclick="newPostForm()">New Post</button>
    <br>
    ${postCard}
    `;
    console.log(_data);
}

// // display user buddies
// function displayBuddies() {

// }

// // display user images
// function displayUserImages() {

// }

// // display user likes
// function displayLikedPosts() {

// }

// // display users favorite topics
// function displayTopics() {

// }