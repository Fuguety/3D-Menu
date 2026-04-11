// LOAD SIDEBAR
fetch('/components/sidebar.html')
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML('afterbegin', data);
    initSidebar();
  });

function initSidebar() {
  const btn = document.querySelector('.menu-btn') as HTMLElement | null;
  const sidebar = document.querySelector('.sidebar') as HTMLElement | null;

  if (!btn || !sidebar) return;

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    btn.classList.toggle('active');
  });
}

// LOAD FOOTER
fetch('/components/footer.html')
  .then(res => res.text())
  .then(data => {
    const wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('beforeend', data);
    }
  });


  /*
// LOAD CHATBOT
fetch('/components/chatbot.html')
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML('beforeend', data);

    // Wait a tiny moment so DOM updates
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = '/chat-script.js';
      document.body.appendChild(script);
    }, 0);
  });


function initChatbot() {
  const toggle = document.querySelector('.chat-toggle') as HTMLElement | null;
  const popup = document.querySelector('.chat-popup') as HTMLElement | null;

  if (!toggle || !popup) return;

  toggle.addEventListener('click', () => {
    popup.classList.toggle('active');
  });
}
  */