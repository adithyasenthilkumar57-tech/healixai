import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are CuraAI, an AI health assistant built into the HealixAI platform. You are powered by Google Gemini.

IMPORTANT RULES:
1. You provide EDUCATIONAL health information ONLY — never diagnose or prescribe treatment.
2. Always end responses with a disclaimer when giving health advice.
3. Detect EMERGENCY keywords (chest pain, heart attack, stroke, can't breathe, unconscious, suicide, overdose) and IMMEDIATELY advise calling 112.
4. Support both English and Tamil — respond in the same language the user writes in.
5. Be compassionate, clear, and helpful. Use simple, non-jargon language.
6. Use markdown formatting for clarity (bold, bullets, numbered lists).
7. Keep responses concise but comprehensive — aim for 150-300 words.
8. When explaining medical reports, highlight what is high/low/normal.

EMERGENCY DETECTION: If you detect any emergency symptoms, start your response with:
🚨 EMERGENCY ALERT: [brief description]
Please call 112 immediately or go to the nearest emergency room.

DISCLAIMER (add to health advice): *Note: This is educational information only. Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment.*`;

const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', "can't breathe", 'cannot breathe', 'unconscious',
  'suicide', 'kill myself', 'overdose', 'severe bleeding', 'not breathing', 'no pulse',
  'மார்பு வலி', 'மாரடைப்பு', 'சுவாசிக்க முடியவில்லை', 'தற்கொலை',
];

function detectEmergency(text) {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

export async function POST(request) {
  try {
    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const isEmergency = detectEmergency(lastMessage);

    // Check for valid API key
    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key') && !apiKey.includes('your_api_key');

    if (!isValidKey) {
      // Return realistic response when no valid API key is set
      const mockResponse = isEmergency
        ? '🚨 **EMERGENCY ALERT:** This sounds like a medical emergency!\n\nPlease **call 112 immediately** or go to the nearest emergency room.\n\nDo not wait — get emergency help now.'
        : `Hello! I'm **CuraAI**, your AI health assistant.\n\nBased on your query: *"${lastMessage}"*\n\nHere are some helpful insights:\n\n- **Stay Hydrated**: Drink adequate water throughout the day.\n- **Monitor Symptoms**: Keep track of when symptoms start and their intensity.\n- **Consult a Doctor**: If symptoms persist or worsen, schedule an evaluation with a healthcare professional.\n\n*Note: To connect to live Google Gemini AI, add a valid GEMINI_API_KEY to \`.env.local\`.*`;

      return Response.json({
        message: mockResponse,
        isEmergency,
        disclaimer: true,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      // Build conversation history
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      const responseText = result.response.text();

      return Response.json({
        message: responseText,
        isEmergency,
        disclaimer: !isEmergency,
      });
    } catch (apiError) {
      console.warn('Gemini API call failed, using fallback response:', apiError);
      return Response.json({
        message: `I'm CuraAI, your AI health assistant.\n\nRegarding *"${lastMessage}"*:\n\nPlease monitor your symptoms closely. If you feel unwell or experience discomfort, consult a doctor.\n\n*Educational information only.*`,
        isEmergency,
        disclaimer: true,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { message: 'I apologize, I encountered a temporary issue. Please try again.', isEmergency: false },
      { status: 200 }
    );
  }
}
