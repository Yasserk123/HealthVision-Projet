import React from 'react';
import { Heart, Brain, Baby, Eye, Bone, Stethoscope } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';

const Specialties: React.FC = () => {
  const specialties = [
    {
      icon: Heart,
      title: 'Cardiologie',
      description: 'Diagnostic et traitement des maladies cardiovasculaires avec les technologies les plus avancées.',
      services: ['Échographie cardiaque', 'Électrocardiogramme', 'Test d\'effort', 'Holter cardiaque'],
      image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg'
    },
    {
      icon: Brain,
      title: 'Neurologie',
      description: 'Prise en charge des troubles du système nerveux central et périphérique.',
      services: ['IRM cérébrale', 'EEG', 'Consultations mémoire', 'Traitement migraines'],
      image: 'https://images.pexels.com/photos/4173258/pexels-photo-4173258.jpeg'
    },
    {
      icon: Baby,
      title: 'Pédiatrie',
      description: 'Soins médicaux spécialisés pour les nourrissons, enfants et adolescents.',
      services: ['Vaccinations', 'Suivi croissance', 'Urgences pédiatriques', 'Développement'],
      image: 'https://images.pexels.com/photos/4173256/pexels-photo-4173256.jpeg'
    },
    {
      icon: Eye,
      title: 'Ophtalmologie',
      description: 'Diagnostic et traitement des pathologies oculaires et de la vision.',
      services: ['Examens de vue', 'Chirurgie cataracte', 'Traitement glaucome', 'Rétinopathie'],
      image: 'https://images.pexels.com/photos/4173252/pexels-photo-4173252.jpeg'
    },
    {
      icon: Bone,
      title: 'Orthopédie',
      description: 'Traitement des troubles du système musculo-squelettique.',
      services: ['Chirurgie arthroscopique', 'Prothèses', 'Traumatologie', 'Médecine du sport'],
      image: 'https://images.pexels.com/photos/4173250/pexels-photo-4173250.jpeg'
    },
    {
      icon: Stethoscope,
      title: 'Médecine Générale',
      description: 'Soins de santé primaires et suivi médical global des patients.',
      services: ['Consultations générales', 'Bilans de santé', 'Prévention', 'Suivi chronique'],
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Nos Spécialités Médicales
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services médicaux spécialisés, 
            assurés par des experts reconnus dans leur domaine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={specialty.image} 
                    alt={specialty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                      <specialty.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{specialty.title}</h3>
                  <p className="text-gray-600 mb-4">{specialty.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Services inclus :</h4>
                    <ul className="space-y-1">
                      {specialty.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Prendre Rendez-vous
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

export default Specialties;