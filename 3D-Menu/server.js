import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY; // replace with your real key from https://aistudio.google.com/app/apikey


import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/gemini", async (req, res) =>
{
  //!const apiKey = "YOUR_API_KEY"; 
  const { prompt } = req.body;

  try
  {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    res.json({ output: text });
  }
  catch (error)
  {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching Gemini response" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
