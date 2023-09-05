let posts = [];
const inputEl = document.getElementById('input-el');
const ulEl = document.getElementById('ul-el');
const saveBtn = document.getElementById('save-btn');
const saveTabBtn = document.getElementById('save-tab-btn');

// Get posts from local storage, iff they exist
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('posts'));

if (leadsFromLocalStorage) {
  posts = leadsFromLocalStorage;
  render();
}

// Function to render all posts
function render() {
  ulEl.innerHTML = posts
    .map((post) => ({
      ...post,
      html:
        'url' in post
          ? `<a target='_blank' href='${post.url}'>${post.text}</a>`
          : post.text,
    }))
    .map((post) => ({
      ...post,
      html: `${post.html}<button id="delete-btn" onclick="deletePost(${post.id})">Delete</button>`,
    }))
    .map((post) => `<li>${post.html}</li>`)
    .reduce((acc, curr) => acc + curr, '');
}

// Event listeners ---------------------------
saveTabBtn.addEventListener('click', () => {
  new Promise((resolve, reject) => {
    resolve(browser.tabs.query({ active: true, currentWindow: true }));
  })
    .catch(() => {
      console.log('browser.tabs unavailable, fetching url with chrome.tabs...');
      chrome.tabs.query({ active: true, currentWindow: true });
    })
    .then((tabs) => tabs[0].url)
    .catch(() => {
      console.log(
        'chrome.tabs unavailable, fetching url with window.location.href...'
      );
      return window.location.href;
    })
    .then((url) => {
      const text = inputEl.value.trim();

      posts.push({
        text: text.length != 0 ? text : url,
        url: url,
        id: generateRandom(),
      });

      inputEl.value = '';
      localStorage.setItem('posts', JSON.stringify(posts));
      render();
    });
});

saveBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();

  if (text.length != 0) {
    posts.push({ text: text, id: generateRandom() });
    inputEl.value = '';
    localStorage.setItem('posts', JSON.stringify(posts));
    render();
  }
});

const generateRandom = () => Math.floor(Math.random() * 9999999);

const deletePost = (id) => {
  posts = posts.filter((post) => post.id != id);
  localStorage.setItem('posts', JSON.stringify(posts));
  render();
};
