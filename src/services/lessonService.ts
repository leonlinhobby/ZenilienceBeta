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
You are a mental health and wellness expert. Create 5 personalized lessons for a user with the following data:

User Profile:
- Name: ${profile?.full_name || 'Unknown'}
- Age: ${profile?.age || 'Unknown'}
- Occupation: ${profile?.occupation || 'Unknown'}
- Interests: ${profile?.interests?.join(', ') || 'Unknown'}

Current Metrics:
- Current Streak: ${streaks?.current_streak || 0} days
- Completed Lessons: ${streaks?.total_lessons_completed || 0}
- Last Stress Level: ${healthMetrics?.[0]?.stress_level || 'Unknown'}
- Last Mood: ${healthMetrics?.[0]?.mood_score || 'Unknown'}

Create 5 lessons as a JSON array with this structure:
[
  {
    "title": "Lesson Title",
    "description": "Brief description",
    "lesson_type": "meditation|breathing|cbt|mindfulness|challenge|education",
    "content": {
      "instruction": "Instruction for the user",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "duration": 5,
      "tips": ["Tip 1", "Tip 2"]
    },
    "estimated_duration": 5,
    "difficulty_level": "beginner|intermediate|advanced"
  }
]

Important:
- All text in English
- Personalized to user data
- Various lesson types
- Practical and actionable
- Adapted to stress level and mood

Respond only with the JSON array, no further explanation.
`;

    const response = await sendMessageToDeepSeek(
      lessonPrompt,
      [],
      {
        temperature: 0.8,
        model: 'deepseek/deepseek-r1-0528',
        maxTokens: 2000,
        systemPrompt: 'You are a mental health expert creating personalized wellness lessons.'
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
          title: "Morning Meditation",
          description: "Start your day with a calming meditation.",
          lesson_type: "meditation",
          content: {
            instruction: "Find a quiet place and sit comfortably.",
            steps: ["Close your eyes", "Breathe deeply in and out", "Focus on your breath"],
            duration: 5,
            tips: ["Don't worry if your thoughts wander", "Gently return to your breath"]
          },
          estimated_duration: 5,
          difficulty_level: "beginner"
        },
        {
          title: "4-7-8 Breathing Exercise",
          description: "A simple breathing technique for relaxation.",
          lesson_type: "breathing",
          content: {
            instruction: "Breathe following the 4-7-8 rhythm.",
            steps: ["Inhale for 4 seconds", "Hold for 7 seconds", "Exhale for 8 seconds"],
            duration: 5,
            tips: ["Repeat 4-5 cycles", "Focus only on counting"]
          },
          estimated_duration: 5,
          difficulty_level: "beginner"
        },
        {
          title: "Thought Check",
          description: "Examine and question your thoughts.",
          lesson_type: "cbt",
          content: {
            instruction: "Identify a troubling thought.",
            steps: ["Write down the thought", "Ask: Is this really true?", "Find a more balanced perspective"],
            duration: 10,
            tips: ["Be patient with yourself", "It's normal that this takes practice"]
          },
          estimated_duration: 10,
          difficulty_level: "intermediate"
        },
        {
          title: "Mindful Walking",
          description: "Connect with the present moment while walking.",
          lesson_type: "mindfulness",
          content: {
            instruction: "Walk slowly and mindfully.",
            steps: ["Feel your feet on the ground", "Notice sounds", "Observe your surroundings"],
            duration: 15,
            tips: ["Have no destination", "Simply be present"]
          },
          estimated_duration: 15,
          difficulty_level: "beginner"
        },
        {
          title: "Digital Detox Challenge",
          description: "Reduce your screen time for better wellbeing.",
          lesson_type: "challenge",
          content: {
            instruction: "Avoid all screens for the next 2 hours.",
            steps: ["Put phone on silent", "Do something else", "Reflect on the experience"],
            duration: 120,
            tips: ["Prepare an alternative activity", "Tell others you'll be offline"]
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