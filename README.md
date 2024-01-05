# Buddies - A Team Project

## Introduction
The Microblog Network project called **Buddies** focuses on building a website that lets users share posts and insights stories with other users.

## Built With
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Bootstrap 5](https://getbootstrap.com/)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Figma](https://www.figma.com/)
* [Particles.js](https://vincentgarreau.com/particles.js/)
* [Free AI Logo Maker](https://looka.com/logo-maker/)


## Page Descriptions and Sample Screenshots

### 1. index.html
Here is the sample image of the landing page:
![Sign-in page](/assets/readme/landing-sample.PNG)

### 2. signup/index.html
Here is the sample image of the sign-up page:
![Sign-up page](/assets/readme/sign-up-sample.PNG)

### 3. posts/index.html
Here is the sample image of the post page:
![Posts page](/assets/readme/posts-sample.PNG)

### 4. profile/index.html
Here is the sample image of the profile page:
![Profile page](/assets/readme/profile-sample.png)

### 5. Code Highlight:

```javascript
// cache to store user name and bio from the posts
let userCache = {};

/**
 * Checks if the post author is in *userCache*.
 * If post author is found in cache, use the cache to add *fullName* and *bio* to the post object.
 * Otherwise, fetch the post author information, add it to the cache and to the post object.
 * @param {*} post
 * @returns post with name of the author and bio
 */
async function fetchAuthorInformation(post) {
  // If user information is in the cache, use it directly
  if (userCache[post.username]) {
    return {
      ...post,
      fullName: userCache[post.username].fullName,
      bio: userCache[post.username].bio,
    };
    //fetch user information if not found in cache
  } else {
    let userPostInfoResponse = await fetch(`${apiURL}/users/${post.username}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    });

    let userPostInfo = await userPostInfoResponse.json();

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

    return { ...post, fullName: userPostInfo.fullName, bio: userPostInfo.bio };
  }
}
```

1. The function `fetchAuthorInformation` takes a `post` object as an argument.
   
2. It checks if the `post.username` exists in the `userCache`. If it does, it means the user information is already cached, and it returns a new post object with `fullName` and `bio` added from the cache.

3. If the user information is not found in the cache, it fetches the user information from `/users/[user]` API endpoint using the fetch function.

4. It then checks if the fetch was successful and if the user exists. If not, it returns a default post object with the `username`, `fullName` set to 'Deleted User', and an empty bio.

5. If the user information is successfully fetched, it adds the user information to the `userCache` for future use.
Finally, it returns a new `post` object with `fullName` and `bio` added from the fetched user information.

## 🚀 Deployed Link
* [Visit Live Site](https://buddies.isaaccortes.com/)

## Authors

 **Pavlo Sernetskyi** 
- [Link to Github](https://github.com/PavloSernetskyi)
- [Link to LinkedIn](https://www.linkedin.com/in/pavlo-sernetskyi)

 **Mia McClure** 
- [Link to Github](https://github.com/MiaMcClure)
- [Link to LinkedIn](https://www.linkedin.com/in/mia-mcclure-7b6a91267/)

 **Isaac Cortez Hernandez** 
- [Link to Github](https://github.com/icortes)
- [Link to LinkedIn](https://www.linkedin.com/in/cortes-isaac/)

## Acknowledgments
- [Animated Profile Card](https://www.youtube.com/watch?v=b2jVm6EAJt0)
- [Remsey](https://www.linkedin.com/in/remseymailjard/)