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
  let postsHTML = '';

  for (let i = 0; i < posts.length; i++) {
    const text = posts[i].text;

    if ('url' in posts[i] && 'text' in posts[i]) {
      postsHTML += `
            <li>
                <a target='_blank' href='${posts[i].url}'>
                    ${posts[i].text}
                </a>
            </li>
        `;
    } else if ('text' in posts[i]) {
      postsHTML += `<li>${posts[i].text}</li>`;
    } else {
      postsHTML += `
                <li>
                    <a target='_blank' href='${posts[i].url}'>
                        ${posts[i].url} 
                    </a>
                </li>
            `;
    }
  }

  

  ulEl.innerHTML = postsHTML;
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

      if (text.length != 0) {
        posts.push({ text: inputEl.value, url: url });
      } else {
        posts.push({ url: url });
      }

      inputEl.value = '';
      localStorage.setItem('posts', JSON.stringify(posts));
      render();
    });
});

saveBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();

  if (text.length != 0) {
    posts.push({ text: text });
    inputEl.value = '';
    localStorage.setItem('posts', JSON.stringify(posts));
    render();
  }
});
