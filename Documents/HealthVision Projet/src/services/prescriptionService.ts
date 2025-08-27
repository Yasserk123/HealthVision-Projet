import { supabase, Prescription } from '../lib/supabase';

export const prescriptionService = {
  // Récupérer les ordonnances d'un patient
  async getPatientPrescriptions(): Promise<Prescription[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Créer une ordonnance (pour les médecins)
  async createPrescription(
    patientId: string,
    doctorId: string,
    medications: Array<{ name: string; dosage: string }>,
    instructions: string,
    duration: string
  ): Promise<Prescription> {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        medications,
        instructions,
        duration,
      })
      .select(`
        *,
        doctor:doctors(*)
      `)
      .single();

    if (error) throw error;

    // Créer une notification pour le patient
    await supabase
      .from('notifications')
      .insert({
        user_id: patientId,
        title: 'Nouvelle ordonnance',
        message: `Une nouvelle ordonnance a été créée par ${data.doctor.name}`,
        type: 'prescription'
      });

    return data;
  }
};