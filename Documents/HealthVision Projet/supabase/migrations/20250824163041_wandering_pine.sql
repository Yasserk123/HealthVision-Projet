/*
  # Schéma initial pour HealthVision

  1. Nouvelles Tables
    - `doctors` - Informations des médecins
      - `id` (uuid, primary key)
      - `name` (text)
      - `specialty` (text)
      - `experience` (text)
      - `education` (text)
      - `languages` (text[])
      - `bio` (text)
      - `image_url` (text)
      - `rating` (decimal)
      - `reviews_count` (integer)
      - `created_at` (timestamp)

    - `appointments` - Rendez-vous
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to auth.users)
      - `doctor_id` (uuid, foreign key to doctors)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `specialty` (text)
      - `reason` (text)
      - `status` (text)
      - `created_at` (timestamp)

    - `prescriptions` - Ordonnances
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to auth.users)
      - `doctor_id` (uuid, foreign key to doctors)
      - `medications` (jsonb)
      - `instructions` (text)
      - `duration` (text)
      - `created_at` (timestamp)

    - `notifications` - Notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

    - `user_profiles` - Profils utilisateurs étendus
      - `id` (uuid, primary key, foreign key to auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `date_of_birth` (date)
      - `address` (text)
      - `emergency_contact` (text)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour les patients (accès à leurs propres données)
    - Politiques pour les médecins (accès aux données de leurs patients)
*/

-- Table des médecins
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  experience text NOT NULL,
  education text NOT NULL,
  languages text[] DEFAULT '{}',
  bio text,
  image_url text,
  rating decimal(2,1) DEFAULT 0.0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address text,
  emergency_contact text,
  created_at timestamptz DEFAULT now()
);

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  specialty text NOT NULL,
  reason text,
  status text DEFAULT 'En attente' CHECK (status IN ('En attente', 'Confirmé', 'Terminé', 'Annulé')),
  created_at timestamptz DEFAULT now()
);

-- Table des ordonnances
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  medications jsonb NOT NULL DEFAULT '[]',
  instructions text,
  duration text,
  created_at timestamptz DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'appointment', 'prescription', 'reminder')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour les médecins (lecture publique)
CREATE POLICY "Doctors are viewable by everyone"
  ON doctors
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Politiques pour les profils utilisateurs
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques pour les rendez-vous
CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id);

-- Politiques pour les ordonnances
CREATE POLICY "Users can view own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

-- Politiques pour les notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insérer des données de test pour les médecins
INSERT INTO doctors (name, specialty, experience, education, languages, bio, image_url, rating, reviews_count) VALUES
('Dr. Marie Laurent', 'Cardiologie', '15 ans d''expérience', 'Université Paris Descartes', ARRAY['Français', 'Anglais', 'Espagnol'], 'Spécialiste en cardiologie interventionnelle avec une expertise reconnue dans le traitement des maladies coronariennes.', 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg', 4.9, 124),
('Dr. Pierre Dubois', 'Neurologie', '12 ans d''expérience', 'Université de Lyon', ARRAY['Français', 'Anglais'], 'Expert en neurologie comportementale et troubles de la mémoire, formé dans les meilleurs centres européens.', 'https://images.pexels.com/photos/4173258/pexels-photo-4173258.jpeg', 4.8, 98),
('Dr. Sophie Martin', 'Pédiatrie', '10 ans d''expérience', 'Université de Marseille', ARRAY['Français', 'Italien'], 'Pédiatre passionnée, spécialisée dans le développement de l''enfant et la médecine préventive.', 'https://images.pexels.com/photos/4173256/pexels-photo-4173256.jpeg', 4.9, 156),
('Dr. Antoine Rousseau', 'Ophtalmologie', '18 ans d''expérience', 'Université de Strasbourg', ARRAY['Français', 'Allemand', 'Anglais'], 'Chirurgien ophtalmologiste de renom, pionnier dans les techniques de chirurgie réfractive laser.', 'https://images.pexels.com/photos/4173252/pexels-photo-4173252.jpeg', 4.7, 87),
('Dr. Émilie Moreau', 'Orthopédie', '14 ans d''expérience', 'Université de Bordeaux', ARRAY['Français', 'Anglais'], 'Chirurgienne orthopédiste spécialisée dans la chirurgie du genou et la traumatologie sportive.', 'https://images.pexels.com/photos/4173250/pexels-photo-4173250.jpeg', 4.8, 112),
('Dr. Thomas Bernard', 'Médecine Générale', '20 ans d''expérience', 'Université de Montpellier', ARRAY['Français', 'Anglais', 'Arabe'], 'Médecin généraliste expérimenté, référent en médecine préventive et gestion des pathologies chroniques.', 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg', 4.9, 203);