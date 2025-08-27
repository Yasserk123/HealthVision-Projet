import { supabase, Doctor } from '../lib/supabase';

export const doctorService = {
  // Récupérer tous les médecins
  async getAllDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Récupérer un médecin par ID
  async getDoctorById(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les médecins par spécialité
  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialty', specialty)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Récupérer les spécialités disponibles
  async getSpecialties(): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('specialty')
      .order('specialty');

    if (error) throw error;
    
    const specialties = [...new Set(data?.map(d => d.specialty) || [])];
    return specialties;
  }
};