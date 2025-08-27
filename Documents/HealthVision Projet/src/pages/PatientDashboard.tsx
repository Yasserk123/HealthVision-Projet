import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Bell, User, Heart, Clock, Download, Eye } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';
import { notificationService } from '../services/notificationService';
import { Appointment, Prescription, Notification } from '../lib/supabase';

const PatientDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      const fetchData = async () => {
        try {
          const [appointmentsData, prescriptionsData, notificationsData] = await Promise.all([
            appointmentService.getPatientAppointments(),
            prescriptionService.getPatientPrescriptions(),
            notificationService.getUserNotifications()
          ]);
          
          setAppointments(appointmentsData);
          setPrescriptions(prescriptionsData);
          setNotifications(notificationsData);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user, authLoading]);

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Veuillez vous connecter pour accéder à votre espace.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Bonjour, {user.name}
          </h1>
          <p className="text-xl text-gray-600">Bienvenue dans votre espace patient</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'overview', label: 'Vue d\'ensemble', icon: Heart },
              { key: 'appointments', label: 'Rendez-vous', icon: Calendar },
              { key: 'prescriptions', label: 'Ordonnances', icon: FileText },
              { key: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0.1} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Résumé de santé</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Prochain RDV</h3>
                    {appointments.length > 0 ? (
                      <>
                        <p className="text-blue-600 font-medium">{appointments[0].doctor?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointments[0].appointment_date).toLocaleDateString('fr-FR')} - {appointments[0].appointment_time}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">Aucun rendez-vous programmé</p>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Dernière consultation</h3>
                    {appointments.filter(apt => apt.status === 'Terminé').length > 0 ? (
                      <>
                        <p className="text-green-600 font-medium">
                          {appointments.filter(apt => apt.status === 'Terminé')[0].doctor?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointments.filter(apt => apt.status === 'Terminé')[0].appointment_date).toLocaleDateString('fr-FR')}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">Aucune consultation récente</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Rappels importants</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Prise de sang à jeun prévue avant le prochain RDV</li>
                    <li>• Pensez à apporter vos anciens examens</li>
                  </ul>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
                
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all">
                    <Calendar className="h-5 w-5 mx-auto mb-2" />
                    Nouveau RDV
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-700 p-4 rounded-xl hover:bg-gray-200 transition-all">
                    <FileText className="h-5 w-5 mx-auto mb-2" />
                    Mes documents
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-700 p-4 rounded-xl hover:bg-gray-200 transition-all">
                    <User className="h-5 w-5 mx-auto mb-2" />
                    Mon profil
                  </button>
                </div>
              </div>
            </AnimatedCard>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {appointments.map((appointment, index) => (
              <AnimatedCard key={appointment.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor?.name}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'Confirmé' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <strong>Heure:</strong> {appointment.appointment_time}
                    </div>
                    <div>
                      <strong>Statut:</strong> {appointment.status}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            {prescriptions.map((prescription, index) => (
              <AnimatedCard key={prescription.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Ordonnance</h3>
                        <p className="text-gray-600">{prescription.doctor?.name}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {new Date(prescription.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Durée:</strong> {prescription.duration}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Médicaments prescrits:</h4>
                    <ul className="space-y-1">
                      {prescription.medications.map((med: any, medIndex: number) => (
                        <li key={medIndex} className="text-sm text-gray-600">• {med.name} - {med.dosage}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Instructions:</strong> {prescription.instructions}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <AnimatedCard key={notification.id} delay={index * 0.1}>
                <div className={`bg-white rounded-2xl shadow-xl p-6 ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === 'appointment' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {notification.type === 'appointment' ? (
                        <Calendar className={`h-5 w-5 ${
                          notification.type === 'appointment' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <FileText className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;