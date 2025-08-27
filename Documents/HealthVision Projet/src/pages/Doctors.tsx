import React, { useState, useEffect } from 'react';
import { Star, Award, Calendar, MapPin } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../lib/supabase';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await doctorService.getAllDoctors();
        setDoctors(doctorsData);
      } catch (err) {
        setError('Erreur lors du chargement des médecins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des médecins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Nos Médecins Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rencontrez notre équipe de professionnels de santé hautement qualifiés, 
            dédiés à votre bien-être et à des soins d'excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <AnimatedCard key={doctor.id} delay={index * 0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
                    <img 
                      src={doctor.image_url} 
                      alt={doctor.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  
                  <div className="absolute -bottom-6 left-6">
                    <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{doctor.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-blue-600 font-semibold mb-1">{doctor.specialty}</p>
                  <p className="text-gray-500 text-sm mb-3">{doctor.experience}</p>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{doctor.bio}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {doctor.education}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Langues:</span> {doctor.languages.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {doctor.reviews_count} avis patients
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Prendre Rendez-vous</span>
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;