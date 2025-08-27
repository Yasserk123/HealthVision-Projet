import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  education: string;
  languages: string[];
  bio: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
  emergency_contact: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  specialty: string;
  reason: string;
  status: 'En attente' | 'Confirmé' | 'Terminé' | 'Annulé';
  created_at: string;
  doctor?: Doctor;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medications: Array<{ name: string; dosage: string }>;
  instructions: string;
  duration: string;
  created_at: string;
  doctor?: Doctor;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'appointment' | 'prescription' | 'reminder';
  read: boolean;
  created_at: string;
}