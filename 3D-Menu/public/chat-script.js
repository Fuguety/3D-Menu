
let chatHistory = [];
const MENU_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHD1DJau3iVDkIdYuLgVdMXFgaDyTondE--XxKCt5dhPMsyWhzP8DQreQ_syFdzi2Emj5GWIknBctj/pub?gid=1557089817&single=true&output=csv";
let MENU_CACHE = null;
let MENU_PROMISE = null;

function loadMenu()
 {
    if (MENU_CACHE) return Promise.resolve(MENU_CACHE);
    if (MENU_PROMISE) return MENU_PROMISE;

    MENU_PROMISE = fetch(MENU_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, 
          {

            header: true,
            skipEmptyLines: true,
            transformHeader: header => header.trim().replace(/\s|-/g, "_"),
            transform: value => value.trim()

          });

        MENU_CACHE = parsed.data;
        console.log("Menu data loaded:", MENU_CACHE);
        return MENU_CACHE;
      })

      .catch(error => 
        {
          
          console.error("Error fetching menu data:", error);
          MENU_CACHE = [];
          return MENU_CACHE;
          
        });

    return MENU_PROMISE;
}

loadMenu();


async function fetchGeminiResponse(userMessage)
{
  await loadMenu();
  const menuText = JSON.stringify(MENU_CACHE, null, 2);


  const prompt = `You are a friendly restaurant assistant from the restaurant Miro's Pizzeria.
  Here is some information about the restaurant:
  Opening Hours:  Sunday to Thursday 10:00 am to 22:00, Friday and Saturday 10:00 am to 23:00.
  Birkenmatt 25, 6343 Risch-Rotkreuz, Switzerland
  Phone:  041 790 49 57
  Cuisine: Kebab Pizza
  Dishes: Pizza, Pasta, Salads, Kebaps, Burgers, Pide, Snacks, and Desserts.
  To drink: Soft Drinks, Wine, Cold drinks, and Warm drinks.
  ALL PRICES ARE IN SWISS FRANCS (CHF).

  Here is the full menu (from Google Sheets):
  ${menuText}

  The customer said: "${userMessage}".
  Your job is to analyze the customer's message and act according to it. 
  Whenever you are asked for a recommendation ask if they are allergic to anything or have any dietary restrictions before making a suggestion then provide popular dishes from the restaurant's menu.

 
  Here are some guidelines to follow when responding:S
  Always respond in a friendly and helpful manner.
  If the customer's message is unclear or does not pertain to restaurant-related inquiries, respond with "I'm here to help with restaurant recommendations and information. Could you please clarify your request?".
  Do not respond with anything unrelated to restaurant or menu options.
  Do not acknowledge that you are an AI model.
  Do not make any recommendations outside of the restaurant context.
  Do not provide any personal opinions.
  Do not give information or comments on politics, religion, social topics, economy, philosophy, or any other non-restaurant-related subjects.
  Do not accept requests for jokes, stories, or any non-restaurant-related content.
  Do not accept requests for coding, programming, or technical support.
  Do not accept requests for medical, legal, or financial advice.
  Limit the information you provide to only what is relevant to the restaurant and its menu.
  Limit your responses to a maximum of 150 words.
  Limit menu item suggestions to a maximum of 5 items per response, and ask if they want to see more.
  Format your menu responses clearly using bullet points or line breaks, for example:
    - Kebab im Fladenbrot — CHF 15.00  
    - Kebab Box — CHF 15.00  
    - Vegi Kebab Käse — CHF 15.00  

  Avoid markdown symbols like ** or * for bold text. Use plain, human-readable formatting.


  Keep your responses concise and relevant to the customer's inquiry so long it complies with the previous guidlines.
  If a request violates any of the above guidelines, respond with "I'm here to help with restaurant recommendations and information. Could you please clarify your request?".`;

  try 
  {
    const response = await fetch('http://localhost:3000/api/gemini',
    {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.output || data;
  }
  catch (error)
  {
    console.error("Error fetching Gemini response:", error);
    return "Sorry, I couldn’t think of a suggestion right now!";
  }
}


// simple chat box
document.addEventListener('DOMContentLoaded', () =>
{
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');

  if (!chatForm) 
  {
    return;
  }

  // helper function to add messages to the chat
  function addMessage(sender, text)
  {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text; // or .innerHTML if you want to allow <br>
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  chatForm.addEventListener('submit', async (e) =>
  {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) 
    {
      return;
    }

    // user message
    addMessage('user', userMessage);
    chatInput.value = '';

    // show loading indicator for AI
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai', 'loading');
    loadingDiv.textContent = 'Typing...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try
    {
      // AI reply
      const aiReply = await fetchGeminiResponse(userMessage);

      // remove loading indicator
      loadingDiv.remove();

      // display AI message
      addMessage('ai', aiReply);
    }
    catch (error)
    {
      // remove loading indicator on error
      loadingDiv.remove();

      // fallback message
      addMessage('ai', 'Sorry, something went wrong.');
    }
  });
});


// floating chat popup toggle
document.addEventListener('DOMContentLoaded', () =>
{
  const toggle = document.getElementById('chat-toggle');
  const popup = document.getElementById('chat-popup');
  const closeBtn = document.getElementById('chat-close');

  if (!toggle || !popup) 
  {
    return;
  }
  popup.style.display = 'none';

  toggle.addEventListener('click', () =>
  {
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
    popup.style.flexDirection = 'column';
  });

  closeBtn.addEventListener('click', () =>
  {
    popup.style.display = 'none';
  });
});


// expand / resize chat popup
document.addEventListener('DOMContentLoaded', () =>
{
  const expandBtn = document.getElementById('chat-expand');
  const popup = document.getElementById('chat-popup');

  if (!expandBtn || !popup)
  {
    return;
  }

  expandBtn.addEventListener('click', () =>
  {
    popup.classList.toggle('expanded');
  });
});



