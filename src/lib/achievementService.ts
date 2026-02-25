import { supabase } from './supabase';

export interface Achievement {
  id: string;
  learner_id: string;
  title: string;
  description: string;
  badge_type: string;
  achievement_type: string;
  auto_awarded: boolean;
  awarded_by: string;
  awarded_date: string;
  created_at: string;
}

export async function awardTopPerformerAchievement(
  learnerId: string,
  learnerName: string,
  score: number
): Promise<Achievement | null> {
  try {
    const existingAchievement = await supabase
      .from('achievements')
      .select('*')
      .eq('learner_id', learnerId)
      .eq('achievement_type', 'TopPerformer')
      .eq('auto_awarded', true)
      .maybeSingle();

    if (existingAchievement.data) {
      return existingAchievement.data;
    }

    const { data, error } = await (supabase as any)
      .from('achievements')
      .insert([{
        learner_id: learnerId,
        title: 'Top Performer',
        description: `Achieved outstanding performance with a score of ${score}%`,
        badge_type: 'Excellence',
        achievement_type: 'TopPerformer',
        auto_awarded: true,
        awarded_by: 'system',
        awarded_date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error awarding top performer achievement:', error);
    return null;
  }
}

export async function awardImprovementAchievement(
  learnerId: string,
  learnerName: string,
  previousScore: number,
  newScore: number
): Promise<Achievement | null> {
  try {
    const improvement = newScore - previousScore;

    if (improvement <= 0) {
      return null;
    }

    const { data, error } = await (supabase as any)
      .from('achievements')
      .insert([{
        learner_id: learnerId,
        title: 'Most Improved',
        description: `Improved score by ${improvement}% (from ${previousScore}% to ${newScore}%)`,
        badge_type: 'Improvement',
        achievement_type: 'Improvement',
        auto_awarded: true,
        awarded_by: 'system',
        awarded_date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error awarding improvement achievement:', error);
    return null;
  }
}

export async function fetchAchievements(teacherId: string): Promise<Achievement[]> {
  try {
    const { data: learners } = await (supabase as any)
      .from('learners')
      .select('id')
      .eq('teacher_id', teacherId);

    if (!learners || learners.length === 0) {
      return [];
    }

    const learnerIds = learners.map((l: any) => l.id);

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .in('learner_id', learnerIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

export async function fetchAchievementsByLearner(learnerId: string): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('learner_id', learnerId)
      .order('awarded_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching learner achievements:', error);
    return [];
  }
}
