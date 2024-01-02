/* Posts Page JavaScript */

'use strict';

let loginData = getLoginData();
let apiURL = 'http://microbloglite.us-east-2.elasticbeanstalk.com/api';
let postsLimit = 10;
let postsOffset = 0;

let postsContainer = document.getElementById('postsContainer');
let spinner = document.getElementById('spinner');

// cache to store user name and bio from the posts
const userCache = {};

/**
 * Fetch user information for the left sidebar.
 */
async function fetchUserInfo() {
  // fetch for user data
  let userResponse = await fetch(`${apiURL}/users/${loginData.username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
    },
  });

  let user = await userResponse.json();
  console.log(user);

  document.getElementById('userFullName').textContent = user.fullName;
  document.getElementById('userName').textContent = `@${user.username}`;
  document.getElementById('userBio').textContent = user.bio;
}

/**
 * Checks if the post author is in *userCache*.
 * If post author is found in cache, use the cache to add *fullName* and *bio* to the post object.
 * Otherwise, fetch the post author information, add it to the cache and to the post object.
 * @param {*} post
 * @returns post with name of the author and bio
 */
async function fetchAuthorInformation(post) {
  if (userCache[post.username]) {
    console.log('using cache for:', post.username);
    // If user information is in the cache, use it directly
    return {
      ...post,
      fullName: userCache[post.username].fullName,
      bio: userCache[post.username].bio,
    };
  } else {
    console.log('using fetch for new person:', post.username);

    let userPostInfoResponse = await fetch(`${apiURL}/users/${post.username}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    let userPostInfo = await userPostInfoResponse.json();
    console.log(userPostInfo);

    //if the user is not found/deleted
    if (!userPostInfoResponse.ok || userPostInfo.status == '404') {
      //throw new Error(`Error fetching user information for ${post.username}`);
      return { ...post, fullName: 'Deleted User', bio: '' };
    }

    // Store user information in the cache
    userCache[post.username] = {
      fullName: userPostInfo.fullName,
      bio: userPostInfo.bio,
    };

    console.log(userCache);
    return { ...post, fullName: userPostInfo.fullName, bio: userPostInfo.bio };
  }
}

// Async function to sequentially resolve posts
async function sequentiallyResolvePosts(posts) {
  try {
    let resolvedPosts = [];

    for (const post of posts) {
      const resolvedPost = await fetchAuthorInformation(post);
      resolvedPosts.push(resolvedPost);
    }

    return resolvedPosts;
  } catch (error) {
    // Handle errors during the sequential resolution
    throw new Error(`Error resolving posts sequentially: ${error.message}`);
  }
}

async function fetchPosts() {
  // fetch for posts
  let postsResponse = await fetch(
    `${apiURL}/posts?limit=${postsLimit},offset=${postsOffset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  let posts = await postsResponse.json();
  console.log(posts);

  let postsContainer = document.getElementById('postsContainer');

  sequentiallyResolvePosts(posts).then((resolvedPosts) => {
    console.log(resolvedPosts);

    postsContainer.innerHTML = '';

    resolvedPosts.forEach((post) => {
      addPostToPage(post);
    });

    //add connections after all users have been cached
    addConnectionsFromCache();
  });
}

function addPostToPage(post, position = 'beforeend') {
  //heart
  const isLiked = post.likes.find((like) => like.username == loginData.username);
  console.log(isLiked);

  const heart = () => {
    if (isLiked) return '<i class="bi bi-heart-fill pe-1 text-danger"></i>';
    return '<i class="bi bi-heart pe-1 text-danger"></i>';
  };

  //date
  const postDate = new Date(post.createdAt);
  console.log('Post Date: ', postDate);

  const nowDate = new Date();
  console.log('Now: ', nowDate);

  const timestamp = () => {
    function getDifferenceInDays(date1, date2) {
      const diffInDays = Math.abs(date2 - date1);
      return diffInDays / (1000 * 60 * 60 * 24);
    }

    function getDifferenceInHours(date1, date2) {
      const diffInHrs = Math.abs(date2 - date1);
      return diffInHrs / (1000 * 60 * 60);
    }

    function getDifferenceInMinutes(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / (1000 * 60);
    }

    function getDifferenceInSeconds(date1, date2) {
      const diffInSecs = Math.abs(date2 - date1);
      return diffInSecs / 1000;
    }

    const days = Math.floor(getDifferenceInDays(postDate, nowDate));
    const hours = Math.floor(getDifferenceInHours(postDate, nowDate));
    const minutes = Math.floor(getDifferenceInMinutes(postDate, nowDate));
    const seconds = Math.floor(getDifferenceInSeconds(postDate, nowDate));

    if (days > 0) return days + 'd';
    else if (hours > 0) return hours + 'hr';
    else if (minutes > 0) return minutes + 'min';
    else return seconds + 's';
  };

  let postHTML = ` <div class="col-12">
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
                            <span class="nav-item small fw-normal"> @${
                              post.username
                            } </span>
                            <span class="nav-item small text-secondary fw-normal"
                              >• ${timestamp()}</span
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
                      <button class="nav-link mb-0 text-black" data-postId="${
                        post._id
                      }" onclick="likeHandler(this);">
                        ${
                          post.likes.length
                            ? `${heart()} ${post.likes.length}`
                            : `${heart()}`
                        }</button
                      >
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

  postsContainer.insertAdjacentHTML(position, postHTML);
}

function addConnectionsFromCache() {
  let connectionsContainer = document.getElementById('connectionsContainer');

  connectionsContainer.innerHTML = '';
  for (const key of Object.keys(userCache)) {
    //skip person logged in from who to follow
    if (loginData.username == key) continue;

    let connectionHtml = `<div class="hstack gap-2 mb-3">

                    <div class="avatar">
                      <a href="#"
                        ><img class="avatar-img rounded-circle" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="" width="48px"
                      /></a>
                    </div>
                    
                    <div class="overflow-hidden">
                      <a class="h6 mb-0" href="#!">${userCache[key].fullName} </a>
                      <p class="mb-0 small text-truncate">${userCache[key].bio}</p>
                    </div>
                    
                    <button
                      class="btn btn-primary-soft rounded-circle icon-md ms-auto"
                      onclick="addFriend();"
                      data-username="${key}"
                      ><i class="bi bi-plus-circle fs-3"></i></button>
                  </div>`;

    connectionsContainer.insertAdjacentHTML('beforeend', connectionHtml);
  }
  let viewMore = `
                  <div class="d-grid mt-3">
                    <a class="btn btn-sm btn-primary-soft" href="#">View more</a>
                  </div>`;
  connectionsContainer.insertAdjacentHTML('beforeend', viewMore);
}

function newPostHandler() {
  let submitNewPost = document.getElementById('submitNewPost');
  submitNewPost.addEventListener('click', async () => {
    let newPost = document.getElementById('newPost');
    let text = newPost.value;

    //handle empty text area
    if (text == '') {
      console.log('empty text area');
    } else {
      let postResponse = await fetch(`${apiURL}/posts`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log(postResponse.ok);

      if (postResponse.ok) {
        postsContainer.innerHTML = '';
        postsContainer.insertAdjacentHTML('beforeend', spinner.outerHTML);

        await fetchPosts();
      }
    }

    newPost.value = null;
  });
}

async function likeHandler(element) {
  let postId = element.getAttribute('data-postId');
  console.log('postId: ', postId);

  //get fresh copy of post by id
  const postResponse = await fetch(`${apiURL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
    },
  });

  const postData = await postResponse.json();
  console.log(postData);

  const postLikes = postData.likes;

  const like = postLikes.find((like) => like.username == loginData.username);

  console.log(element);

  //if user is in likes array delete like
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  if (postLikes.length != 0 && like?.username == loginData.username) {
    console.log(like._id);

    let response = await fetch(`${apiURL}/likes/${like._id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    let data = await response.json();
    let newLikesCount = Number(element.textContent) - 1;

    if (newLikesCount <= 0)
      element.innerHTML = `<i class="bi bi-heart pe-1 text-danger"></i>`;
    else
      element.innerHTML = `<i class="bi bi-heart pe-1 text-danger"></i> ${newLikesCount}`;
    console.log(data);
  } else {
    let likeCount = Number(element.textContent) + 1;
    console.log(likeCount);

    let response = await fetch(`${apiURL}/likes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });

    let data = await response.json();

    element.innerHTML = `<i class="bi bi-heart-fill pe-1 text-danger"></i> ${likeCount}`;
    console.log(data);
  }
}

//on window load
onload = async () => {
  await fetchUserInfo();

  await fetchPosts();

  newPostHandler();
};
