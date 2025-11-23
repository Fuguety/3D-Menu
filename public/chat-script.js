// public/ai-script.js

async function fetchGeminiResponse(userMessage)
{
  const prompt = `You are a friendly restaurant assistant.
  The customer said: "${userMessage}".
  Suggest a dish from the menu that fits their taste and explain briefly why.
  Keep it short and friendly.`;

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

