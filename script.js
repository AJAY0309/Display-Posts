const postsContainer = document.getElementById('posts');

const fetchData = async(url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetching error: ', error);
        return null;
    }
};

// posts
const displayPosts = async() => {
    const posts = await fetchData('https://jsonplaceholder.typicode.com/posts');
    const users = await fetchData('https://jsonplaceholder.typicode.com/users');

    if (!posts || !users) {
        postsContainer.innerHTML = '<p class="error">Failed to load posts or users.</p>';
        return;
    }

    const userMap = {};
    users.forEach(user => {
        userMap[user.id] = user;
    });

    // posts html code is here it self
    postsContainer.innerHTML = posts.map(post => `
      <div class="post" data-post-id="${post.id}">
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <div class="user-info">
          <p>Posted by: ${userMap[post.userId].name}</p>
          <p>Email: ${userMap[post.userId].email}</p>
        </div>
        <button class="view-comments" data-post-id="${post.id}">View Comments</button>
        <div class="comments hidden" id="comments-${post.id}"></div>
      </div>
    `).join('');

    //"View Comments" button
    document.querySelectorAll('.view-comments').forEach(button => {
        button.addEventListener('click', (event) => {
            const postId = event.target.getAttribute('data-post-id');
            toggleComments(postId);
        });
    });
};

// Toggle comments visibility
const toggleComments = async(postId) => {
    const commentsContainer = document.getElementById(`comments-${postId}`);

    if (commentsContainer.classList.contains('hidden')) {
        const comments = await fetchData(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!comments) {
            commentsContainer.innerHTML = '<p class="error">Failed to load comments.</p>';
        } else {
            commentsContainer.innerHTML = comments.map(comment => `
          <div class="comment">
            <p><strong>${comment.name}</strong> (${comment.email})</p>
            <p>${comment.body}</p>
          </div>
        `).join('');
            commentsContainer.classList.remove('hidden');
        }
    } else {
        commentsContainer.classList.add('hidden');
    }
};

displayPosts();