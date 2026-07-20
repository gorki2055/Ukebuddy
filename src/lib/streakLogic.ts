import { supabase } from './supabase';

export async function recordPracticeCompletion(userId: string) {
  try {
    // 1. Fetch current profile to get current streak
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('streak')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;

    const currentStreak = profile?.streak || 0;

    // 2. Fetch the most recent daily_progress
    const { data: lastProgress, error: progressError } = await supabase
      .from('daily_progress')
      .select('day_number, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (progressError) throw progressError;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today local time

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Start of yesterday

    let newDayNumber = 1;
    let newStreak = currentStreak;

    if (lastProgress && lastProgress.completed_at) {
      const lastCompletedDate = new Date(lastProgress.completed_at);
      lastCompletedDate.setHours(0, 0, 0, 0); // Normalize to midnight local time

      if (lastCompletedDate.getTime() === today.getTime()) {
        // Already practiced today!
        console.log('Already practiced today. Streak maintained.');
        return { success: true, newStreak: currentStreak, message: 'Already practiced today' };
      } else if (lastCompletedDate.getTime() === yesterday.getTime()) {
        // Practiced yesterday, streak continues!
        newStreak += 1;
        newDayNumber = lastProgress.day_number + 1;
      } else {
        // Streak broken
        newStreak = 1;
        newDayNumber = lastProgress.day_number + 1; // Keep total day number going up
      }
    } else {
      // First time ever practicing
      newStreak = 1;
      newDayNumber = 1;
    }

    // 3. Insert new daily_progress
    const { error: insertError } = await supabase
      .from('daily_progress')
      .insert({
        user_id: userId,
        day_number: newDayNumber
      });
      
    if (insertError) throw insertError;

    // 4. Update user profile streak
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ streak: newStreak })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, newStreak };

  } catch (error) {
    console.error('Error recording practice completion:', error);
    return { success: false, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('display_name, streak')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
