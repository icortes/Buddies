"use strict";
window.onload = init;
function init(event) {
    event.preventDefault();
    document.getElementById('title').innerText = `${username}'s Profile`;

  


    
    getUserData(username);
    findRequests();

    console.log(userBuddies);
   
}
const username = JSON.parse(localStorage.getItem('login-data')).username;
const display = document.getElementById("user-display");
const editForm = document.getElementById("edit-user-data");
const token = JSON.parse(window.localStorage.getItem("login-data")).token;
let userBuddies = [];

// turn into animation 
// function greetUser(user) {
//     document.getElementById("greeting").innerText = `Welcome ${user}`;
// }


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
        document.getElementById('userFullName').innerText = data.fullName;
        document.getElementById('userName').innerText = username;

    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
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
        // testing
        
        // console.log(data);
        displayPost(data);
    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }
}

//  new post form
function newPostForm() {
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
        postCard += ` <div class="col-12">
        <!-- Card feed item START -->
        <div class="card h-100">
          <!-- Card body START -->
          <div class="card-body">
            <!-- Post User -->
            <div class="d-flex align-items-center mb-2">
              <!-- Avatar -->
              <div class="avatar avatar-story me-2">
                <a href="#!">
                  <img
                    class="avatar-img rounded-circle"
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    alt=""
                    width="40px" />
                </a>
              </div>
              <!-- Info -->
              <div>
                <div class="nav nav-divider">
                  <h6 class="nav-item card-title mb-0">
                    <a href="#">
                      ${post.fullName}
                      <span class="nav-item small fw-normal"> @${post.username
            } </span>
                      <span class="nav-item small text-secondary fw-normal"
                        >• ${post.createdAt}</span
                      ></a
                    >
                  </h6>
                </div>
                <p class="mb-0 small">${post.bio}</p>
              </div>
            </div>
            <!-- Info -->
            <p class="text-body"
              >${post.text}</p
            >

            <!-- LIKE SHARE COMMENT -->
            <ul
              class="nav nav-pills nav-pills-light nav-fill nav-stack small border-top py-1 mt-3 mb-0">
              <li class="nav-item">
                <!-- add active class when liked -->
                <button class="nav-link mb-0 text-black" data-postId="${post._id
            }" onclick="likeHandler(this);"><img class="bi bi-heart-fill pe-1 text-danger"></img>
                  ${post.likes.length}</button>
              </li>
              <!-- Card share action menu START -->
              <li class="nav-item dropdown">
                <a
                  href="#"
                  class="nav-link mb-0 text-black"
                  id="cardShareAction4"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <i class="bi bi-reply-fill flip-horizontal ps-1"></i>Share
                </a>
                <!-- Card share action dropdown menu -->
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="cardShareAction4">
                  <li>
                    <a class="dropdown-item" href="">
                      <i class="bi bi-envelope fa-fw pe-2"></i>Send via Direct
                      Message</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="">
                      <i class="bi bi-bookmark-check fa-fw pe-2"></i>Bookmark
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="">
                      <i class="bi bi-link fa-fw pe-2"></i>Copy link to post</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="">
                      <i class="bi bi-share fa-fw pe-2"></i>Share post via …</a
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item" href="">
                      <i class="bi bi-pencil-square fa-fw pe-2"></i>
                      Share to News Feed
                    </a>
                  </li>
                </ul>
              </li>
              <!-- Card share action menu END -->
              <li class="nav-item">
                <a class="nav-link text-black" href="">
                  <i class="bi bi-chat-fill pe-1"></i>Comments (12)
                </a>
              </li>
            </ul>
          </div>
          <!-- Card body END -->
        </div>
        <!-- Card feed item END -->
      </div>`;
    });
    display.innerHTML = `
    <button class="btn btn-primary" onclick="newPostForm()">New Post</button>
    <br>
    ${postCard}
    `;
    console.log(_data);
}

// when liked post button is clicked
function getLikedPosts() {

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            displayLikedPosts(data)
        })
        .catch(err => {
            alert(`error ${err}`)
        })
}

// filter through post liked by user
function displayLikedPosts(_data) {
    let userLikedPosts = [];
    _data.forEach(post => {
        let likes = post.likes;
        likes.forEach(item => {
            if (item.username == username) {
                userLikedPosts.push(post);
            }
        })
    });
    displayPost(userLikedPosts);
}
//TODO add buddy functionality
// request buddy post function 
function requestBuddy(_username) {
    const postText = `@${_username} and ${username} #New`;
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
            display.innerHTML = `Request Posted!`;
            let buddyPost = data._id;
            //    once request has been made, create user profile with username as post id
            saveRequest(buddyPost)
        })
        .catch(err => {
            alert(`error ${err}`)
        });
}

// save buddy request as new users
function saveRequest(requestId) {

    const requestProfile = {

        username: requestId,
        fullName: "string",
        password: "string",

    }

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
        method: 'POST',
        body: JSON.stringify(requestProfile),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
           
            console.log(data);

        })
        .catch(err => {
            alert(`error ${err}`)
        });
}

//  filter through post and find buddy request
async function findRequests(){
    
    const baseUrl = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=10&offset=0&username=";
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    if (!username) {
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
        const buddyRequest = data.map(item => item._id);

        await Promise.all(buddyRequest.map(request => findRequestProfile(request)));
        
        // console.log(buddyRequest);
    } catch (error) {
        console.error(`There was a problem with the fetch operation`, error)
    }  

}

async function findRequestProfile(id) {
    const baseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/";
    try {
        const response = await fetch(baseURL + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            redirect: 'follow'
        });
        if(!response.ok) {
            if(response.status === 404) {
                console.warn(`user does not exist`)
            } else {
                console.log(`${response.status}`)
            }
            return;
        }
        const data = await response.json();
        // place function here
        getRequestPost(data.username);
    } catch (error) {
        console.warn(`there was an error with the fetch request`, error)
    }
}

// function to find request post
function getRequestPost(_data){
    const baseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/";
    fetch(baseURL + _data, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            const message = data.text;
            // use regular expressions to get requested user's username
            const requestedBuddy = message.match(/@(\w+)(?:\s|$)/);
            const requestedBuddyUsername = requestedBuddy ? requestedBuddy[1] : null;
            console.log(requestedBuddyUsername)
            addToBuddyList(data.likes, requestedBuddyUsername);
           
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

// function to add buddy to buddy list
function addToBuddyList(likesArray, _data) {
   
    for (let index = 0; index < likesArray.length; index++) {
        if (likesArray[index].username === _data) {
            userBuddies.push(_data);
        }
    }
    return userBuddies;
}

// // display user images
// function displayUserImages() {

// }

// // display user likes
// function displayLikedPosts() {

// }

// // display users favorite topics
// function displayTopics() {

// }