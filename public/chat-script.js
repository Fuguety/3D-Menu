// public/ai-script.js

const MENU_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHD1DJau3iVDkIdYuLgVdMXFgaDyTondE--XxKCt5dhPMsyWhzP8DQreQ_syFdzi2Emj5GWIknBctj/pub?gid=1557089817&single=true&output=csv";
let MENU_CACHE = null;

async function loadMenuFromSheet() {
  if (MENU_CACHE) return MENU_CACHE; // simple cache

  const res = await fetch(MENU_CSV_URL);
  const csvText = await res.text();

  const parsed = Papa.parse(csvText, {
    header: true,          // use first row as header
    skipEmptyLines: true,
  });

  const rows = parsed.data;

  // Expecting columns: Category, Item, Description, Price
  const menuItems = rows.map(row => ({
    category: row.Category?.trim(),
    name: row.Item?.trim(),
    description: (row.Description || "").trim(),
    price: (row.Price || "").trim(),
  }));

  MENU_CACHE = menuItems;
  return menuItems;
}

// Turn menu into text for the prompt
function menuToPromptText(items) {
  return items
    .map(
      item =>
        `${item.category}: ${item.name} - ${item.description} (${item.price} CHF)`
    )
    .join("\n");
}
async function fetchGeminiResponse(userMessage)
{
  const menuItems = await loadMenuFromSheet();
  const menuText = menuToPromptText(menuItems);
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

 
  Here are some guidelines to follow when responding:
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

  if (!chatForm) return;

  chatForm.addEventListener('submit', async (e) =>
  {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    chatInput.value = "";

    const aiReply = await fetchGeminiResponse(userMessage);
    chatBox.innerHTML += `<p><strong>AI:</strong> ${aiReply}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  });
});



// floating chat popup toggle
document.addEventListener('DOMContentLoaded', () =>
{
  const toggle = document.getElementById('chat-toggle');
  const popup = document.getElementById('chat-popup');
  const closeBtn = document.getElementById('chat-close');

  if (!toggle || !popup) return;

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

