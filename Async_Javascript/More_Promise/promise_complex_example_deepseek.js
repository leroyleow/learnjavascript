//https://chat.deepseek.com/a/chat/s/adcb25f1-935f-4bc9-a3d1-50472c6726f8
//// Mock API functions that return Promises
const API = {
    getUser: (userId) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = {
            1: { id: 1, name: 'John Doe', email: 'john@example.com' },
            2: { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          };
          const user = users[userId];
          user ? resolve(user) : reject(new Error('User not found'));
        }, 500);
      });
    },

    getPosts: (userId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const posts = {
            1: [
              { id: 101, title: 'Post 1', body: 'Content 1' },
              { id: 102, title: 'Post 2', body: 'Content 2' }
            ],
            2: [
              { id: 201, title: 'Post 3', body: 'Content 3' }
            ]
          };
          resolve(posts[userId] || []);
        }, 800);
      });
    },

    getComments: (postId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const comments = {
            101: [
              { id: 1001, text: 'Great post!' },
              { id: 1002, text: 'Thanks for sharing' }
            ],
            102: [
              { id: 1003, text: 'Very helpful' }
            ],
            201: [] // No comments for post 201
          };
          resolve(comments[postId] || []);
        }, 300);
      });
    }
  };

  // Main function using async/await
  async function getUserData(userId) {
    try {
      // 1. Fetch user
      const user = await API.getUser(userId);
      console.log(`Fetched user: ${user.name}`);

      // 2. Fetch user's posts
      const posts = await API.getPosts(user.id);
      console.log(`Found ${posts.length} posts`);

      // 3. Fetch comments for all posts in parallel
      const postsWithComments = await Promise.all(
        posts.map(async post => {
          const comments = await API.getComments(post.id);
          return {
            ...post,
            comments,
            commentCount: comments.length
          };
        })
      );

      // 4. Process and combine all data
      const result = {
        user,
        posts: postsWithComments,
        totalPosts: posts.length,
        totalComments: postsWithComments.reduce((sum, post) => sum + post.commentCount, 0)
      };

      return result;

    } catch (error) {
      console.error('Error in getUserData:', error.message);
      // Re-throw the error after logging
      throw error;
    }
  }

  // Alternative implementation using promise chaining
  function getUserDataChain(userId) {
    return API.getUser(userId)
      .then(user => {
        console.log(`Fetched user: ${user.name}`);
        return Promise.all([user, API.getPosts(user.id)]);
      })
      .then(([user, posts]) => {
        console.log(`Found ${posts.length} posts`);
        return Promise.all([
          user,
          Promise.all(
            posts.map(post =>
              API.getComments(post.id)
                .then(comments => ({
                  ...post,
                  comments,
                  commentCount: comments.length
                }))
            )
          )
        ]);
      })
      .then(([user, postsWithComments]) => ({
        user,
        posts: postsWithComments,
        totalPosts: postsWithComments.length,
        totalComments: postsWithComments.reduce((sum, post) => sum + post.commentCount, 0)
      }))
      .catch(error => {
        console.error('Error in getUserDataChain:', error.message);
        throw error;
      });
  }

  // Usage
  (async () => {
    try {
      console.log('--- Using async/await ---');
      const data = await getUserData(1);
      console.log('Final result:', data);

      console.log('\n--- Using promise chaining ---');
      const data2 = await getUserDataChain(2);
      console.log('Final result:', data2);

      // Test error case
      console.log('\n--- Testing error handling ---');
      await getUserData(99); // Non-existent user
    } catch (error) {
      console.error('Final catch:', error.message);
    }
  })();