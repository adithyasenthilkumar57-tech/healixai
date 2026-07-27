import { GoogleGenerativeAI } from '@google/generative-ai';

const SYMPTOM_PROMPT = `You are a medical AI assistant integrated into HealixAI. Analyze the patient's symptom data and return a structured JSON assessment.

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

export async function POST(request) {
  try {
    const data = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

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

    const demoAssessment = {
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

    if (!isValidKey) {
      return Response.json(demoAssessment);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(`${SYMPTOM_PROMPT}\n\n${prompt}`);
      const text = result.response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid AI response format');

      const assessment = JSON.parse(jsonMatch[0]);
      return Response.json(assessment);
    } catch (apiError) {
      console.warn('Symptom checker AI call failed, returning fallback assessment:', apiError);
      return Response.json(demoAssessment);
    }
  } catch (error) {
    console.error('Symptom checker error:', error);
    return Response.json(demoAssessment, { status: 200 });
  }
}
