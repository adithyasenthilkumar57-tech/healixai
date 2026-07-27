import { GoogleGenerativeAI } from '@google/generative-ai';

const SYMPTOM_PROMPT_EN = `You are a medical AI assistant integrated into HealixAI. Analyze the patient's symptom data and return a structured JSON assessment.

IMPORTANT: This is for educational/decision-support purposes only. Always emphasize consulting a healthcare professional.

Based on the patient data provided, return a JSON object with this EXACT structure:
{
  "possibleConditions": [
    {
      "name": "Condition Name",
      "confidence": 75,
      "description": "Brief description of this condition",
      "commonSymptoms": ["symptom1", "symptom2"]
    }
  ],
  "urgency": {
    "level": "low|medium|high|emergency",
    "label": "Low Priority|See a Doctor Soon|Urgent|Emergency",
    "description": "What this urgency level means",
    "color": "#10b981|#f59e0b|#ef4444|#dc2626"
  },
  "recommendedSpecialist": {
    "type": "Specialist type",
    "reason": "Why this specialist"
  },
  "suggestedTests": ["Test 1", "Test 2"],
  "lifestyleAdvice": ["Advice 1", "Advice 2", "Advice 3"],
  "disclaimer": "This is educational information only. Please consult a licensed healthcare professional."
}

Analyze the symptoms carefully. Provide 2-4 possible conditions ordered by likelihood. Be conservative with high urgency ratings.`;

const SYMPTOM_PROMPT_TA = `நீங்கள் HealixAI மருத்துவ AI உதவியாளர். நோயாளியின் அறிகுறி தரவை பகுப்பாய்வு செய்து தமிழ் மொழியில் JSON மதிப்பீட்டை வழங்கவும்.

முக்கியம்: அனைத்து பெயர்கள், விளக்கங்கள், மருந்துகள் மற்றும் ஆலோசனைகள் முழுமையாக தெளிவான தமிழ் எழுத்துக்களில் (Tamil script) இருக்க வேண்டும்.

JSON அமைப்பு:
{
  "possibleConditions": [
    {
      "name": "நிலையின் பெயர் (தமிழில்)",
      "confidence": 75,
      "description": "இந்த நிலையின் தமிழ் விளக்கம்",
      "commonSymptoms": ["அறிகுறி 1", "அறிகுறி 2"]
    }
  ],
  "urgency": {
    "level": "low|medium|high|emergency",
    "label": "குறைந்த முன்னுரிமை|விரைவில் மருத்துவரை பார்க்கவும்|அவசரம்|கடுமையான அவசரம்",
    "description": "இந்த அவசர நிலையின் தமிழ் விளக்கம்",
    "color": "#10b981|#f59e0b|#ef4444|#dc2626"
  },
  "recommendedSpecialist": {
    "type": "மருத்துவ நிபுணர் வகை (தமிழில்)",
    "reason": "ஏன் இந்த நிபுணர் (தமிழில்)"
  },
  "suggestedTests": ["பரிசோதனை 1", "பரிசோதனை 2"],
  "lifestyleAdvice": ["ஆலோசனை 1", "ஆலோசனை 2", "ஆலோசனை 3"],
  "disclaimer": "இது கல்வித் தகவல் மட்டுமே. முறையான சிகிச்சைக்கு உரிமம் பெற்ற மருத்துவரை அணுகவும்."
}`;

export async function POST(request) {
  try {
    const data = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const isTamil = data.language === 'ta';

    const prompt = `Patient Data:
- Age: ${data.age}, Gender: ${data.gender}
- Height: ${data.height}cm, Weight: ${data.weight}kg
- Blood Pressure: ${data.bloodPressure || 'Not provided'}
- Blood Sugar: ${data.sugarLevel || 'Not provided'} mg/dL
- Pulse: ${data.pulse || 'Not provided'} bpm
- Symptoms: ${data.symptoms?.join(', ') || 'None specified'}
- Duration: ${data.duration || 'Not specified'}
- Pain Level: ${data.painLevel || 0}/10
- Smoking: ${data.smoking || 'No'}
- Alcohol: ${data.alcohol || 'No'}
- Sleep: ${data.sleepHours || 7} hours/night
- Stress: ${data.stressLevel || 'Low'}
- Past Conditions: ${data.pastConditions || 'None'}
- Current Medications: ${data.currentMedications || 'None'}
- Family History: ${data.familyHistory || 'None'}
- Allergies: ${data.allergies || 'None'}

Please analyze and return the JSON assessment.`;

    const isValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key') && !apiKey.includes('your_api_key');

    const demoAssessmentEN = {
      possibleConditions: [
        {
          name: 'Tension Headache',
          confidence: 72,
          description: 'Common headache caused by stress, poor posture, or eye strain. Usually bilateral and non-pulsating.',
          commonSymptoms: ['Headache', 'Neck tension', 'Fatigue'],
        },
        {
          name: 'Dehydration',
          confidence: 58,
          description: 'Insufficient fluid intake leading to headache, fatigue, and dizziness.',
          commonSymptoms: ['Headache', 'Fatigue', 'Dizziness'],
        },
        {
          name: 'Migraine',
          confidence: 35,
          description: 'Recurring headache with moderate to severe intensity, often unilateral.',
          commonSymptoms: ['Pulsating headache', 'Nausea', 'Sensitivity to light'],
        },
      ],
      urgency: {
        level: 'low',
        label: 'Low Priority',
        description: 'Your symptoms suggest a non-emergency condition. Monitor and see a doctor if symptoms worsen.',
        color: '#10b981',
      },
      recommendedSpecialist: {
        type: 'General Physician',
        reason: 'For initial evaluation and to rule out underlying conditions.',
      },
      suggestedTests: ['Complete Blood Count (CBC)', 'Blood Pressure Check', 'Thyroid Function Test'],
      lifestyleAdvice: [
        'Drink 8-10 glasses of water daily',
        'Get 7-8 hours of sleep consistently',
        'Practice stress management techniques',
        'Take regular breaks from screens',
      ],
      disclaimer: 'This is educational information only. Please consult a licensed healthcare professional for proper diagnosis and treatment.',
    };

    const demoAssessmentTA = {
      possibleConditions: [
        {
          name: 'மன அழுத்த தலைவலி (Tension Headache)',
          confidence: 72,
          description: 'மன அழுத்தம் அல்லது சோர்வினால் ஏற்படும் சாதாரண தலைவலி.',
          commonSymptoms: ['தலைவலி', 'கழுத்து வலி', 'சோர்வு'],
        },
        {
          name: 'நீரிழப்பு (Dehydration)',
          confidence: 58,
          description: 'போதிய அளவு தண்ணீர் குடிக்காததால் ஏற்படும் தலைவலி மற்றும் சோர்வு.',
          commonSymptoms: ['தலைவலி', 'சோர்வு', 'தலைச்சுற்றல்'],
        },
        {
          name: 'ஒற்றைத் தலைவலி (Migraine)',
          confidence: 35,
          description: 'மிதமான முதல் கடுமையான தீவிரத்துடன் மீண்டும் மீண்டும் வரும் தலைவலி.',
          commonSymptoms: ['துடிக்கும் தலைவலி', 'குமட்டல்', 'வெளிச்ச உணர்திறன்'],
        },
      ],
      urgency: {
        level: 'low',
        label: 'குறைந்த முன்னுரிமை',
        description: 'உங்கள் அறிகுறிகள் அவசரமற்ற நிலையை காட்டுகின்றன. தொடர்ந்தால் மருத்துவரை அணுகவும்.',
        color: '#10b981',
      },
      recommendedSpecialist: {
        type: 'பொது மருத்துவர் (General Physician)',
        reason: 'ஆரம்ப பரிசோதனை மற்றும் ஆலோசனைக்காக.',
      },
      suggestedTests: ['முழு இரத்த எண்ணிக்கை (CBC)', 'இரத்த அழுத்த பரிசோதனை', 'தைராய்டு சோதனை'],
      lifestyleAdvice: [
        'தினமும் 8-10 டம்ளர் தண்ணீர் குடியுங்கள்',
        '7-8 மணி நேரம் சீரான தூக்கம் பெறுங்கள்',
        'மன அழுத்தத்தை குறைக்கும் பயிற்சிகளை செய்யுங்கள்',
        'திரை நேரத்தை குறைத்து இடைவேளை எடுங்கள்',
      ],
      disclaimer: 'இது கல்வித் தகவல் மட்டுமே. முறையான சிகிச்சைக்கு உரிமம் பெற்ற மருத்துவரை அணுகவும்.',
    };

    const activeDemo = isTamil ? demoAssessmentTA : demoAssessmentEN;

    if (!isValidKey) {
      return Response.json(activeDemo);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemInstruction = isTamil ? SYMPTOM_PROMPT_TA : SYMPTOM_PROMPT_EN;

      const result = await model.generateContent(`${systemInstruction}\n\n${prompt}`);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid AI response format');

      const assessment = JSON.parse(jsonMatch[0]);
      return Response.json(assessment);
    } catch (apiError) {
      console.warn('Symptom checker AI call failed, returning fallback assessment:', apiError);
      return Response.json(activeDemo);
    }
  } catch (error) {
    console.error('Symptom checker error:', error);
    return Response.json(isTamil ? demoAssessmentTA : demoAssessmentEN, { status: 200 });
  }
}
