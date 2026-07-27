import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT_EN = `You are CuraAI, an AI health assistant built into the HealixAI platform. You are powered by Google Gemini.

IMPORTANT RULES:
1. You provide EDUCATIONAL health information ONLY — never diagnose or prescribe treatment.
2. Always end responses with a disclaimer when giving health advice.
3. Detect EMERGENCY keywords (chest pain, heart attack, stroke, can't breathe, unconscious, suicide, overdose) and IMMEDIATELY advise calling 112.
4. Support both English and Tamil — respond in the same language the user writes in, or in Tamil if requested.
5. Be compassionate, clear, and helpful. Use simple, non-jargon language.
6. Use markdown formatting for clarity (bold, bullets, numbered lists).
7. Keep responses concise but comprehensive — aim for 150-300 words.
8. When explaining medical reports, highlight what is high/low/normal.

EMERGENCY DETECTION: If you detect any emergency symptoms, start your response with:
🚨 EMERGENCY ALERT: [brief description]
Please call 112 immediately or go to the nearest emergency room.

DISCLAIMER (add to health advice): *Note: This is educational information only. Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment.*`;

const SYSTEM_PROMPT_TA = `நீங்கள் HealixAI தளத்தில் உள்ள CuraAI எனும் AI சுகாதார உதவியாளர். நீங்கள் Google Gemini தொழில்நுட்பத்தால் இயக்கப்படுகிறீர்கள்.

முக்கிய விதிகள்:
1. நீங்கள் கல்வி நோக்கத்திற்கான சுகாதார தகவல்களை மட்டுமே வழங்க வேண்டும் — நோய் கண்டறியவோ அல்லது மருந்து பரிந்துரைக்கவோ கூடாது.
2. அனைத்து சுகாதார ஆலோசனைகளின் முடிவிலும் மறுப்பு அறிவிப்பை (disclaimer) சேர்க்க வேண்டும்.
3. அவசரகால அறிகுறிகளைக் கண்டறிந்தால் (மார்பு வலி, மாரடைப்பு, பக்கவாதம், மூச்சுத்திணறல், சுயநினைவின்மை) உடனடியாக 112 ஐ அழைக்க அறிவுறுத்த வேண்டும்.
4. அனைத்து பதில்களையும் முழுமையாக தெளிவான தமிழ் எழுத்துக்களில் (தமிழ் வடிவம்) வழங்க வேண்டும்.
5. இரக்கத்துடனும், தெளிவாகவும், பயனுள்ள வகையிலும் பதிலளிக்கவும். எளிய மொழியைப் பயன்படுத்தவும்.
6. தெளிவாக இருக்க மார்க் டவுன் (bold, bullet points) பயன்படுத்தவும்.
7. அவசரகால எச்சரிக்கை கண்டறியப்பட்டால்:
🚨 அவசரகால எச்சரிக்கை: உடனடியாக 112 ஐ அழைக்கவும் அல்லது அருகிலுள்ள அவசர அறைக்கு செல்லவும்.

மறுப்பு அறிவிப்பு: *குறிப்பு: இது கல்வித் தகவல் மட்டுமே. மருத்துவ ஆலோசனை மற்றும் சிகிச்சைக்கு எப்போதும் உரிமம் பெற்ற சுகாதார நிபுணரை அணுகவும்.*`;

const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', "can't breathe", 'cannot breathe', 'unconscious',
  'suicide', 'kill myself', 'overdose', 'severe bleeding', 'not breathing', 'no pulse',
  'மார்பு வலி', 'மாரடைப்பு', 'சுவாசிக்க முடியவில்லை', 'தற்கொலை', 'மயக்கம்', 'இரத்தப்போக்கு'
];

function detectEmergency(text) {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

function containsTamil(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}

export async function POST(request) {
  try {
    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const isEmergency = detectEmergency(lastMessage);
    const isTamilMode = language === 'ta' || containsTamil(lastMessage);

    // Check for valid API key
    const apiKey = process.env.GEMINI_API_KEY;
    const isValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key') && !apiKey.includes('your_api_key');

    if (!isValidKey) {
      // Mock response tuned for English / Tamil
      let mockResponse = '';
      if (isTamilMode) {
        mockResponse = isEmergency
          ? '🚨 **அவசரகால எச்சரிக்கை:** இது மருத்துவ அவசரகாலம் போல் தெரிகிறது!\n\nஉடனடியாக **112 ஐ அழைக்கவும்** அல்லது அருகிலுள்ள அவசர சிகிச்சை பிரிவுக்கு செல்லவும்.\n\nதாமதிக்க வேண்டாம் — உடனடியாக மருத்துவ உதவி பெறுங்கள்.'
          : `வணக்கம்! நான் **CuraAI**, உங்கள் AI சுகாதார உதவியாளர்.\n\nஉங்கள் கேள்வி: *"${lastMessage}"*\n\n**முக்கிய வழிகாட்டுதல்கள்:**\n- **போதுமான நீர் அருந்துங்கள்**: நாள் முழுவதும் நல்ல குடிநீர் அருந்துவது அவசியம்.\n- **அறிகுறிகளை கண்காணியுங்கள்**: உங்கள் அசௌகரியம் எப்போது தோன்றியது மற்றும் அதன் தீவிரத்தை கவனியுங்கள்.\n- **மருத்துவரை அணுகுங்கள்**: அறிகுறிகள் தொடர்ந்தால் அல்லது தீவிரமடைந்தால் உரிமம் பெற்ற மருத்துவரை அணுகவும்.\n\n*குறிப்பு: இது கல்வி தகவல் மட்டுமே.*`;
      } else {
        mockResponse = isEmergency
          ? '🚨 **EMERGENCY ALERT:** This sounds like a medical emergency!\n\nPlease **call 112 immediately** or go to the nearest emergency room.\n\nDo not wait — get emergency help now.'
          : `Hello! I'm **CuraAI**, your AI health assistant.\n\nBased on your query: *"${lastMessage}"*\n\nHere are some helpful insights:\n- **Stay Hydrated**: Drink adequate water throughout the day.\n- **Monitor Symptoms**: Keep track of when symptoms start and their intensity.\n- **Consult a Doctor**: If symptoms persist or worsen, schedule an evaluation with a healthcare professional.\n\n*Note: Educational information only.*`;
      }

      return Response.json({
        message: mockResponse,
        isEmergency,
        disclaimer: true,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const activeSystemPrompt = isTamilMode ? SYSTEM_PROMPT_TA : SYSTEM_PROMPT_EN;
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: activeSystemPrompt,
      });

      // Build conversation history
      const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({ history });
      const promptText = isTamilMode ? `${lastMessage}\n(தயவுசெய்து முழுமையாக தமிழில் பதிலளிக்கவும்)` : lastMessage;
      const result = await chat.sendMessage(promptText);
      const responseText = result.response.text();

      return Response.json({
        message: responseText,
        isEmergency,
        disclaimer: !isEmergency,
      });
    } catch (apiError) {
      console.warn('Gemini API call failed, using fallback response:', apiError);
      const fallbackMsg = isTamilMode
        ? `நான் CuraAI, உங்கள் AI சுகாதார உதவியாளர்.\n\n"${lastMessage}" தொடர்பாக:\n\nஉங்கள் அறிகுறிகளை கவனமாகக் கண்காணிக்கவும். அசௌகரியம் தொடர்ந்தால் மருத்துவரை அணுகவும்.\n\n*கல்வித் தகவல் மட்டுமே.*`
        : `I'm CuraAI, your AI health assistant.\n\nRegarding *"${lastMessage}"*:\n\nPlease monitor your symptoms closely. If you feel unwell or experience discomfort, consult a doctor.\n\n*Educational information only.*`;

      return Response.json({
        message: fallbackMsg,
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
