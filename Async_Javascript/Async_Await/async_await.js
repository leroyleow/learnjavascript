//Async function
//The word "async" before a function means : a function always returns a promise. Other values are wrapped in a resolved promise automatically
async function f(){
    return 1;
}

f().then(console.log); // Output: 1

// below same as above
async function f2() {
    return Promise.resolve(1);
}

f2().then(console.log); // Output: 1

// Await only works inside async function
//await literally suspends the function execution until the promise settles, and then resumes it with the promise result.
async function f3() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 1000)
    });

    let result = await promise; // wait until the promise resolves (*)

    alert(result); // "done!"
  }

  f3();

  async function showAvatar() {

    // read our JSON
    let response = await fetch('/article/promise-chaining/user.json');
    let user = await response.json();

    // read github user
    let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
    let githubUser = await githubResponse.json();

    // show the avatar
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    // wait 3 seconds
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    img.remove();

    return githubUser;
  }

  showAvatar();

//Error handling
async function  f4() {
    await Promise.reject(new Error("Whoops!"));
}

//below is same as above
async function f5(){
    throw new Error("Whoops!");
}

//async/await and promise.then/catch
//When we use async/await, we rarely need .then, because await handles the waiting for us. And we can use a regular try..catch instead of .catch. That’s usually (but not always) more convenient.
async function f6() {

    try {
      let response = await fetch('/no-user-here');
      let user = await response.json();
    } catch(err) {
      // catches errors both in fetch and response.json
      alert(err);
    }
  }

  f6();