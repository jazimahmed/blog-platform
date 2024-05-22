document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Registration failed');
        }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            alert(data.message);
            if (data.message === 'Login successful') {
                document.getElementById('auth').style.display = 'none';
                document.getElementById('blog').style.display = 'block';
                loadPosts();
            }
        } catch (error) {
            alert('Login failed');
        }
    });

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            const data = await response.json();
            if (data.message === 'Post created') {
                loadPosts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to create post');
        }
    });

    async function loadPosts() {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            alert('Failed to load posts');
        }
    }

    async function checkLoginStatus() {
        try {
            const response = await fetch('/api/checkAuth');
            const data = await response.json();
            if (data.authenticated) {
                document.getElementById('auth').style.display = 'none';
                document.getElementById('blog').style.display = 'block';
                loadPosts();
            }
        } catch (error) {
            // User not logged in
        }
    }

    checkLoginStatus();
});