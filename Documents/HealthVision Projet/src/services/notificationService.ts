import { supabase, Notification } from '../lib/supabase';

export const notificationService = {
  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Utilisateur non connecté');

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
  },

  // Créer une notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'] = 'info'
  ): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type
      });

    if (error) throw error;
  }
};