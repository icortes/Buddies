/* Posts Page JavaScript */

'use strict';

let loginData = getLoginData();
let apiURL = 'http://microbloglite.us-east-2.elasticbeanstalk.com/api';
let postsLimit = 10;
let postsOffset = 0;

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

    if (!userPostInfoResponse.ok) {
      throw new Error(`Error fetching user information for ${post.username}`);
    }

    let userPostInfo = await userPostInfoResponse.json();

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
  });
}

function addPostToPage(post) {
  let postsContainer = document.getElementById('postsContainer');

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
                              >• 2hr</span
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
                    class="nav nav-pills nav-pills-light nav-fill nav-stack small border-top py-1 mt-3">
                    <li class="nav-item">
                      <!-- add active class when liked -->
                      <a class="nav-link mb-0" href="">
                        <i class="bi bi-heart pe-1"></i>${
                          post.likes.length ? `Likes (${post.likes.length})` : 'Like'
                        }</a
                      >
                    </li>
                    <!-- Card share action menu START -->
                    <li class="nav-item dropdown">
                      <a
                        href="#"
                        class="nav-link mb-0"
                        id="cardShareAction4"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="bi bi-reply-fill flip-horizontal ps-1"></i>Share (3)
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
                            <i class="bi bi-pencil-square fa-fw pe-2"></i>Share to News
                            Feed</a
                          >
                        </li>
                      </ul>
                    </li>
                    <!-- Card share action menu END -->
                    <li class="nav-item">
                      <a class="nav-link" href="">
                        <i class="bi bi-chat-fill pe-1"></i>Comments (12)</a
                      >
                    </li>
                  </ul>
                </div>
                <!-- Card body END -->
              </div>
              <!-- Card feed item END -->
            </div>`;

  postsContainer.insertAdjacentHTML('beforeend', postHTML);
}

function newPostHandler() {
  // let postsResponse = await fetch(
  //   'http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts',
  //   {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${loginData.token}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   }
  // );
}

//on window load
onload = async () => {
  await fetchUserInfo();

  await fetchPosts();

  newPostHandler();

};
