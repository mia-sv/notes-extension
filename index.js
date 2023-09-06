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
  ulEl.replaceChildren(
    ...posts.map((post) => {
      // Create the base li element for each post
      const postHtml = document.createElement('li');
      postHtml.classList.add('post');

      // Create the post body for each post
      const postBody = document.createElement('div');
      postBody.classList.add('post-body');
      postHtml.appendChild(postBody);

      // Create the post date element and append it to the post body
      const postDate = document.createElement('div');
      postDate.classList.add('post-date');
      postDate.appendChild(document.createTextNode(post.date));
      postBody.appendChild(postDate);

      // Create div with post text
      const postText = document.createElement('div');
      postText.classList.add('post-text');

      // Create and add to the post body the text section for the post
      if ('url' in post) {
        const postTextWithLink = document.createElement('a');
        postTextWithLink.appendChild(document.createTextNode(post.text));
        postTextWithLink.target = '_blank';
        postTextWithLink.href = post.url;

        postText.appendChild(postTextWithLink);
      } else {
        postText.appendChild(document.createTextNode(post.text));
      }

      postBody.appendChild(postText);

      // Create the delete button and append it to the post body
      const postDeleteBtn = document.createElement('button');
      postDeleteBtn.classList.add('delete-btn');
      postDeleteBtn.appendChild(document.createTextNode('Delete'));

      // Add delete listener for each button and append button
      postDeleteBtn.addEventListener('click', () => deletePost(post.id));
      postHtml.appendChild(postDeleteBtn);

      return postHtml;
    })
  );
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
      const newPost = {
        text: text.length != 0 ? text : url,
        url: url,
        id: generateRandom(),
        date: currentDate(),
      };

      posts = [newPost, ...posts];

      inputEl.value = '';
      localStorage.setItem('posts', JSON.stringify(posts));
      render();
    });
});

saveBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();

  if (text.length != 0) {
    const newPost = {
      text: text,
      id: generateRandom(),
      date: currentDate(),
    };

    posts = [newPost, ...posts];

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

const currentDate = () => {
  const date = new Date();

  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const M = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear() - 2000;

  return `${h}:${m} ${d}/${M}/${y}`;
};
