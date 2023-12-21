/* Posts Page JavaScript */

'use strict';

let loginData = getLoginData();

//on window load
onload = async () => {
  let userResponse = await fetch(
    `http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  let user = await userResponse.json();
  console.log(user);

  document.getElementById('userFullName').textContent = user.fullName;
  document.getElementById('userName').textContent = `@${user.username}`;
  document.getElementById('userBio').textContent = user.bio;

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
};
