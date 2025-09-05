import express from 'express';
import axios from 'axios';
const router = express.Router();

// POST /api/gemini
router.post('/', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: input }] }] // Gemini API structure
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ text });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.error?.message || error.message });
  }
});

export default router;
