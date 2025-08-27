import { supabase, Appointment } from '../lib/supabase';

export interface CreateAppointmentData {
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  specialty: string;
  reason?: string;
}

export const appointmentService = {
  // Créer un rendez-vous
  async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        patient_id: user.id,
      })
      .select(`
        *,
        doctor:doctors(*)
      `)
      .single();

    if (error) throw error;

    // Créer une notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Rendez-vous demandé',
        message: `Votre demande de rendez-vous avec ${data.doctor.name} a été envoyée. Nous vous contacterons pour confirmation.`,
        type: 'appointment'
      });

    return data;
  },

  // Récupérer les rendez-vous d'un patient
  async getPatientAppointments(): Promise<Appointment[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq('patient_id', user.id)
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Mettre à jour le statut d'un rendez-vous
  async updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (error) throw error;
  },

  // Annuler un rendez-vous
  async cancelAppointment(appointmentId: string): Promise<void> {
    await this.updateAppointmentStatus(appointmentId, 'Annulé');
  }
};