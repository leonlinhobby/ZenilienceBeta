import { supabase } from '../lib/supabase';
import { Lesson } from '../types/dashboard';
import { sendMessageToDeepSeek } from '../components/ChatBot/api';

export const generateLessons = async (userId: string): Promise<void> => {
  try {
    // Get user profile and health metrics
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: healthMetrics } = await supabase
      .from('user_health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: streaks } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Generate lesson content using AI
    const lessonPrompt = `
Du bist ein Experte für mentale Gesundheit und Wellness. Erstelle 5 personalisierte Lektionen für einen Nutzer mit folgenden Daten:

Nutzer-Profil:
- Name: ${profile?.full_name || 'Unbekannt'}
- Alter: ${profile?.age || 'Unbekannt'}
- Beruf: ${profile?.occupation || 'Unbekannt'}
- Interessen: ${profile?.interests?.join(', ') || 'Unbekannt'}

Aktuelle Metriken:
- Aktuelle Serie: ${streaks?.current_streak || 0} Tage
- Abgeschlossene Lektionen: ${streaks?.total_lessons_completed || 0}
- Letzte Stress-Level: ${healthMetrics?.[0]?.stress_level || 'Unbekannt'}
- Letzte Stimmung: ${healthMetrics?.[0]?.mood_score || 'Unbekannt'}

Erstelle 5 Lektionen als JSON-Array mit dieser Struktur:
[
  {
    "title": "Titel der Lektion",
    "description": "Kurze Beschreibung",
    "lesson_type": "meditation|breathing|cbt|mindfulness|challenge|education",
    "content": {
      "instruction": "Anweisung für den Nutzer",
      "steps": ["Schritt 1", "Schritt 2", "Schritt 3"],
      "duration": 5,
      "tips": ["Tipp 1", "Tipp 2"]
    },
    "estimated_duration": 5,
    "difficulty_level": "beginner|intermediate|advanced"
  }
]

Wichtig:
- Alle Texte auf Deutsch
- Personalisiert auf die Nutzerdaten
- Verschiedene Lektionstypen
- Praktisch und umsetzbar
- Angepasst an Stress-Level und Stimmung

Antworte nur mit dem JSON-Array, keine weitere Erklärung.
`;

    const response = await sendMessageToDeepSeek(
      lessonPrompt,
      [],
      {
        temperature: 0.8,
        model: 'deepseek/deepseek-r1-0528',
        maxTokens: 2000,
        systemPrompt: 'Du bist ein Experte für mentale Gesundheit und erstellst personalisierte Wellness-Lektionen.'
      }
    );

    let lessons: any[];
    try {
      lessons = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback lessons
      lessons = [
        {
          title: "Morgen-Meditation",
          description: "Starte deinen Tag mit einer beruhigenden Meditation.",
          lesson_type: "meditation",
          content: {
            instruction: "Finde einen ruhigen Platz und setze dich bequem hin.",
            steps: ["Schließe die Augen", "Atme tief ein und aus", "Konzentriere dich auf deinen Atem"],
            duration: 5,
            tips: ["Keine Sorge, wenn deine Gedanken abschweifen", "Kehre sanft zu deinem Atem zurück"]
          },
          estimated_duration: 5,
          difficulty_level: "beginner"
        },
        {
          title: "Atemübung 4-7-8",
          description: "Eine einfache Atemtechnik zur Entspannung.",
          lesson_type: "breathing",
          content: {
            instruction: "Atme nach dem 4-7-8 Rhythmus.",
            steps: ["4 Sekunden einatmen", "7 Sekunden anhalten", "8 Sekunden ausatmen"],
            duration: 5,
            tips: ["Wiederhole 4-5 Zyklen", "Konzentriere dich nur auf das Zählen"]
          },
          estimated_duration: 5,
          difficulty_level: "beginner"
        },
        {
          title: "Gedanken-Check",
          description: "Überprüfe und hinterfrage deine Gedanken.",
          lesson_type: "cbt",
          content: {
            instruction: "Identifiziere einen belastenden Gedanken.",
            steps: ["Schreibe den Gedanken auf", "Frage: Ist das wirklich wahr?", "Finde eine ausgewogenere Sichtweise"],
            duration: 10,
            tips: ["Sei geduldig mit dir", "Es ist normal, dass das Üben braucht"]
          },
          estimated_duration: 10,
          difficulty_level: "intermediate"
        },
        {
          title: "Achtsamkeits-Spaziergang",
          description: "Verbinde dich mit der Gegenwart während du gehst.",
          lesson_type: "mindfulness",
          content: {
            instruction: "Gehe langsam und bewusst.",
            steps: ["Spüre deine Füße auf dem Boden", "Nimm Geräusche wahr", "Beobachte deine Umgebung"],
            duration: 15,
            tips: ["Kein Ziel haben", "Einfach nur da sein"]
          },
          estimated_duration: 15,
          difficulty_level: "beginner"
        },
        {
          title: "Digital Detox Challenge",
          description: "Reduziere deine Bildschirmzeit für besseres Wohlbefinden.",
          lesson_type: "challenge",
          content: {
            instruction: "Vermeide für die nächsten 2 Stunden alle Bildschirme.",
            steps: ["Handy stumm schalten", "Etwas anderes machen", "Reflektiere über die Erfahrung"],
            duration: 120,
            tips: ["Bereite eine Alternative vor", "Teile anderen mit, dass du offline bist"]
          },
          estimated_duration: 120,
          difficulty_level: "intermediate"
        }
      ];
    }

    // Save lessons to database
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      await supabase
        .from('lessons')
        .insert({
          user_id: userId,
          title: lesson.title,
          description: lesson.description,
          lesson_type: lesson.lesson_type,
          content: lesson.content,
          estimated_duration: lesson.estimated_duration,
          difficulty_level: lesson.difficulty_level,
          position_in_queue: i + 1
        });
    }

    console.log('Generated and saved lessons successfully');
  } catch (error) {
    console.error('Error generating lessons:', error);
  }
};

export const checkAndGenerateLessons = async (userId: string): Promise<void> => {
  try {
    // Check if user has any incomplete lessons
    const { data: incompleteLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false);

    if (!incompleteLessons || incompleteLessons.length < 2) {
      console.log('Generating new lessons...');
      await generateLessons(userId);
    }
  } catch (error) {
    console.error('Error checking lessons:', error);
  }
};