import React, { useState, useEffect } from 'react';
import { Heart, Camera, Calendar, Phone, MapPin, Search, User, Home, Plus, Bell, Shield, Stethoscope, FileText, Globe, Star, DollarSign, MessageCircle, Navigation, Clock, AlertTriangle, CheckCircle, XCircle, Send, Filter, Map, Users, Activity } from 'lucide-react';

const NaesamPetsApp = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedVetSlot, setSelectedVetSlot] = useState(null);
  const [reportForm, setReportForm] = useState({ type: '', location: '', description: '', urgent: false });
  const [volunteerApplications, setVolunteerApplications] = useState([]);

  // Enhanced sample data
  const rescuePets = [
    {
      id: 1,
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever Mix',
      age: '2 years',
      location: 'Chennai',
      rescueTeam: 'Blue Cross of Hyderabad',
      medicalStatus: 'Fully Vaccinated',
      story: 'Found abandoned, very friendly and loves children',
      image: '🐕',
      verified: true,
      emergency: false,
      adoptionFee: 0,
      specialNeeds: false,
      energyLevel: 'High',
      goodWithKids: true,
      goodWithPets: true,
      vaccinations: ['Rabies', 'DHPP', 'Bordetella'],
      lastVetVisit: '2024-12-15',
      weight: '25kg',
      rescueDate: '2024-11-20',
      fosterer: 'Ravi Kumar',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian Mix',
      age: '1 year',
      location: 'Coimbatore',
      rescueTeam: 'Animal Welfare Chennai',
      medicalStatus: 'Spayed, Vaccinated',
      story: 'Rescued from street, very calm and loves cuddles',
      image: '🐱',
      verified: true,
      emergency: true,
      adoptionFee: 0,
      specialNeeds: true,
      energyLevel: 'Low',
      goodWithKids: true,
      goodWithPets: false,
      vaccinations: ['FVRCP', 'Rabies'],
      lastVetVisit: '2024-12-10',
      weight: '3.5kg',
      rescueDate: '2024-12-01',
      fosterer: 'Meera Devi',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Rocky',
      type: 'Dog',
      breed: 'Indie Dog',
      age: '3 years',
      location: 'Madurai',
      rescueTeam: 'Compassion Unlimited',
      medicalStatus: 'Under Treatment',
      story: 'Recovering from injury, needs loving home',
      image: '🐕‍🦺',
      verified: true,
      emergency: false,
      adoptionFee: 0,
      specialNeeds: true,
      energyLevel: 'Medium',
      goodWithKids: true,
      goodWithPets: true,
      vaccinations: ['Rabies', 'DHPP'],
      lastVetVisit: '2024-12-20',
      weight: '18kg',
      rescueDate: '2024-10-15',
      fosterer: 'Dr. Sunitha',
      rating: 4.7
    }
  ];

  const vetClinics = [
    { id: 1, name: 'Pet Care Clinic', location: 'Anna Nagar, Chennai', rating: 4.8, slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
    { id: 2, name: 'Animal Hospital', location: 'T. Nagar, Chennai', rating: 4.6, slots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
    { id: 3, name: 'Happy Paws Clinic', location: 'Adyar, Chennai', rating: 4.9, slots: ['8:00 AM', '1:00 PM', '6:00 PM'] }
  ];

  const translations = {
    en: {
      appName: 'Naesam Pets',
      tagline: 'Ethical Rescue & Adoption',
      home: 'Home',
      adopt: 'Adopt',
      myPets: 'My Pets',
      profile: 'Profile',
      rescue: 'Rescue',
      volunteer: 'Volunteer',
      donate: 'Donate',
      chat: 'Chat',
      searchPets: 'Search for pets...',
      availableForAdoption: 'Available for Adoption',
      emergency: 'Emergency',
      verified: 'Verified',
      rescueTeam: 'Rescue Team',
      medicalStatus: 'Medical Status',
      location: 'Location',
      age: 'Age',
      breed: 'Breed',
      adoptMe: 'Adopt Me',
      scanBreed: 'Scan Pet Breed',
      bookVet: 'Book Vet',
      emergency: 'Emergency',
      healthStatus: 'Health Status',
      welcomeBack: 'Welcome back',
      noPetsYet: 'No pets adopted yet',
      startAdopting: 'Start your adoption journey!',
      freeEthical: '100% Free & Ethical',
      reportStray: 'Report Stray',
      emergencyRescue: 'Emergency Rescue',
      becomeVolunteer: 'Become Volunteer',
      supportRescue: 'Support Rescue',
      chatWithTeam: 'Chat with Team',
      trackHealth: 'Track Health',
      specialNeeds: 'Special Needs',
      energyLevel: 'Energy Level',
      goodWithKids: 'Good with Kids',
      goodWithPets: 'Good with Pets',
      vaccinations: 'Vaccinations',
      weight: 'Weight',
      lastVetVisit: 'Last Vet Visit',
      fosterer: 'Fosterer',
      all: 'All',
      dogs: 'Dogs',
      cats: 'Cats',
      filter: 'Filter',
      urgent: 'Urgent',
      normal: 'Normal'
    },
    ta: {
      appName: 'நேசம் பெட்ஸ்',
      tagline: 'நெறிமுறை காப்பு & தத்தெடுப்பு',
      home: 'முகப்பு',
      adopt: 'தத்தெடுக்க',
      myPets: 'என் செல்லப்பிராணிகள்',
      profile: 'சுயவிவரம்',
      rescue: 'மீட்பு',
      volunteer: 'தன்னார்வலர்',
      donate: 'நன்கொடை',
      chat: 'உரையாடல்',
      searchPets: 'செல்லப்பிராணிகளைத் தேடுங்கள்...',
      availableForAdoption: 'தத்தெடுப்புக்கு கிடைக்கின்றன',
      emergency: 'அவசரம்',
      verified: 'சரிபார்க்கப்பட்டது',
      rescueTeam: 'மீட்பு குழு',
      medicalStatus: 'மருத்துவ நிலை',
      location: 'இடம்',
      age: 'வயது',
      breed: 'இனம்',
      adoptMe: 'என்னை தத்தெடு',
      scanBreed: 'இனத்தை ஸ்கேன் செய்',
      bookVet: 'மருத்துவரை பதிவு செய்',
      emergency: 'அவசரம்',
      healthStatus: 'உடல்நலம்',
      welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
      noPetsYet: 'இன்னும் செல்லப்பிராணிகள் இல்லை',
      startAdopting: 'உங்கள் தத்தெடுப்பு பயணத்தை தொடங்குங்கள்!',
      freeEthical: '100% இலவசம் & நெறிமுறை'
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Simulate user login and initial data
    setUser({ 
      name: 'Priya Kumar', 
      verified: true, 
      phone: '+91-9876543210',
      email: 'priya.kumar@email.com',
      address: 'Anna Nagar, Chennai',
      joinDate: '2024-01-15',
      adoptionCount: 0,
      volunteerHours: 0,
      donationTotal: 0
    });

    // Sample notifications
    setNotifications([
      { id: 1, type: 'adoption', message: 'Your adoption application for Buddy is under review', time: '2 hours ago', read: false },
      { id: 2, type: 'health', message: 'Vaccination reminder for your pet', time: '1 day ago', read: false },
      { id: 3, type: 'rescue', message: 'New rescue alert in your area', time: '3 days ago', read: true }
    ]);
  }, []);

  const handleAdoptPet = (pet) => {
    const adoptedPet = { 
      ...pet, 
      adoptedDate: new Date().toLocaleDateString(), 
      healthUpdates: [],
      nextVetDate: '2025-01-15',
      medications: [],
      dietPlan: 'Standard adult diet - 2 meals/day'
    };
    setMyPets([...myPets, adoptedPet]);
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      type: 'adoption',
      message: `Adoption request for ${pet.name} submitted successfully!`,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
    
    alert(`Adoption request submitted for ${pet.name}! Rescue team will contact you within 24 hours.`);
  };

  const handleDonation = () => {
    if (!donationAmount) return;
    alert(`Thank you for your donation of ₹${donationAmount}! This will help rescue more animals.`);
    setDonationAmount('');
  };

  const handleReportStray = () => {
    if (!reportForm.description) return;
    alert('Stray animal report submitted! Rescue team will respond within 4 hours.');
    setReportForm({ type: '', location: '', description: '', urgent: false });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    
    // Simulate response
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: 'Thank you for your message. Our team will get back to you shortly.',
        sender: 'team',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const filteredPets = rescuePets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || pet.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const TabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {[
          { id: 'home', icon: Home, label: t.home },
          { id: 'adopt', icon: Heart, label: t.adopt },
          { id: 'rescue', icon: AlertTriangle, label: t.rescue },
          { id: 'myPets', icon: User, label: t.myPets },
          { id: 'more', icon: Plus, label: 'More' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
              currentTab === tab.id ? 'text-green-600 bg-green-50' : 'text-gray-600'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-xs mt-1">{tab.label}</span>
            {tab.id === 'rescue' && notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-b-3xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t.appName}</h1>
          <p className="text-green-100 text-sm">{t.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="p-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
          >
            <Globe size={20} />
          </button>
          <button 
            onClick={() => setCurrentTab('notifications')}
            className="relative p-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
          >
            <Bell size={20} />
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </button>
        </div>
      </div>
      {user && currentTab === 'home' && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm">{t.welcomeBack}, {user.name}</span>
          {user.verified && <Shield size={16} className="text-green-200" />}
        </div>
      )}
    </div>
  );

  const PetCard = ({ pet, showAdoptButton = true, detailed = false }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{pet.image}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
            <p className="text-gray-600 text-sm">{pet.breed}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{pet.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {pet.verified && (
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
              <Shield size={12} className="text-green-600" />
              <span className="text-xs text-green-700">{t.verified}</span>
            </div>
          )}
          {pet.emergency && (
            <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
              <AlertTriangle size={12} className="text-red-600" />
              <span className="text-xs text-red-700">{t.urgent}</span>
            </div>
          )}
          {pet.specialNeeds && (
            <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
              <Heart size={12} className="text-purple-600" />
              <span className="text-xs text-purple-700">{t.specialNeeds}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t.age}:</span>
            <span className="font-medium">{pet.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t.weight}:</span>
            <span className="font-medium">{pet.weight}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t.location}:</span>
          <span className="font-medium flex items-center gap-1">
            <MapPin size={12} />
            {pet.location}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t.rescueTeam}:</span>
          <span className="font-medium text-green-600">{pet.rescueTeam}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t.fosterer}:</span>
          <span className="font-medium text-blue-600">{pet.fosterer}</span>
        </div>
        
        {detailed && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.energyLevel}:</span>
              <span className="font-medium">{pet.energyLevel}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t.goodWithKids}:</span>
              {pet.goodWithKids ? 
                <CheckCircle size={16} className="text-green-600" /> : 
                <XCircle size={16} className="text-red-600" />
              }
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t.goodWithPets}:</span>
              {pet.goodWithPets ? 
                <CheckCircle size={16} className="text-green-600" /> : 
                <XCircle size={16} className="text-red-600" />
              }
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600">{t.vaccinations}:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {pet.vaccinations.map(vacc => (
                  <span key={vacc} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {vacc}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <p className="text-gray-700 text-sm mb-4 italic">"{pet.story}"</p>
      
      {showAdoptButton && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPet(detailed ? null : pet)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-100 transition-all"
          >
            {detailed ? 'Close' : 'View Details'}
          </button>
          <button
            onClick={() => handleAdoptPet(pet)}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
          >
            <Heart size={16} className="inline mr-2" />
            {t.adoptMe}
          </button>
        </div>
      )}
    </div>
  );

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">{t.freeEthical}</h2>
              <p className="text-blue-100">Every adoption saves a life. No sales, only love.</p>
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">1,247</div>
                  <div>Rescued</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">892</div>
                  <div>Adopted</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">156</div>
                  <div>Teams</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentTab('adopt')}
                className="bg-green-50 border border-green-200 p-4 rounded-xl text-center hover:bg-green-100 transition-colors"
              >
                <Heart size={32} className="text-green-600 mx-auto mb-2" />
                <span className="text-green-700 font-semibold">{t.adopt}</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('rescue')}
                className="bg-red-50 border border-red-200 p-4 rounded-xl text-center hover:bg-red-100 transition-colors"
              >
                <AlertTriangle size={32} className="text-red-600 mx-auto mb-2" />
                <span className="text-red-700 font-semibold">{t.reportStray}</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('vet')}
                className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors"
              >
                <Calendar size={32} className="text-blue-600 mx-auto mb-2" />
                <span className="text-blue-700 font-semibold">{t.bookVet}</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('volunteer')}
                className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors"
              >
                <Users size={32} className="text-purple-600 mx-auto mb-2" />
                <span className="text-purple-700 font-semibold">{t.volunteer}</span>
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Urgent Rescues</h3>
              {rescuePets.filter(pet => pet.emergency).slice(0, 2).map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>
        );
        
      case 'adopt':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPets}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 mb-4">
              {['all', 'dog', 'cat'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterType === type ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {type === 'all' ? t.all : type === 'dog' ? t.dogs : t.cats}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{t.availableForAdoption}</h2>
              <span className="text-sm text-gray-600">{filteredPets.length} pets</span>
            </div>
            
            {selectedPet ? (
              <PetCard pet={selectedPet} detailed={true} />
            ) : (
              filteredPets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))
            )}
          </div>
        );
        
      case 'rescue':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Emergency Rescue</h2>
              <p className="text-red-100">Report strays or animals in need</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Report Stray Animal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animal Type</label>
                  <select 
                    value={reportForm.type}
                    onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({...reportForm, location: e.target.value})}
                    placeholder="Enter location or use GPS"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                    placeholder="Describe the animal's condition and situation"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={reportForm.urgent}
                    onChange={(e) => setReportForm({...reportForm, urgent: e.target.checked})}
                    className="rounded text-red-600"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">Mark as urgent (injured/critical)</label>
                </div>
                
                <button
                  onClick={handleReportStray}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  <AlertTriangle size={16} className="inline mr-2" />
                  Submit Report
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <Phone size={32} className="text-blue-600 mx-auto mb-2" />
                <span className="text-blue-700 font-semibold">Emergency Call</span>
                <p className="text-xs text-blue-600 mt-1">24/7 Helpline</p>
              </button>
              
              <button 
                onClick={() => setCurrentTab('chat')}
                className="bg-green-50 border border-green-200 p-4 rounded-xl text-center hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={32} className="text-green-600 mx-auto mb-2" />
                <span className="text-green-700 font-semibold">Live Chat</span>
                <p className="text-xs text-green-600 mt-1">Rescue Teams</p>
              </button>
            </div>
          </div>
        );
        
      case 'myPets':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">{t.myPets}</h2>
            
            {myPets.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">{t.noPetsYet}</p>
                <p className="text-sm text-gray-500 mb-4">{t.startAdopting}</p>
                <button
                  onClick={() => setCurrentTab('adopt')}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Browse Pets
                </button>
              </div>
            ) : (
              <>
                {myPets.map(pet => (
                  <div key={pet.id} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <PetCard pet={pet} showAdoptButton={false} />
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Adopted:</span>
                        <span className="font-medium">{pet.adoptedDate}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Vet Visit:</span>
                        <span className="font-medium text-blue-600">{pet.nextVetDate}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                          <Stethoscope size={16} className="inline mr-1" />
                          Health
                        </button>
                        <button 
                          onClick={() => setCurrentTab('vet')}
                          className="bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm hover:bg-green-100 transition-colors"
                        >
                          <Calendar size={16} className="inline mr-1" />
                          Book Vet
                        </button>
                        <button className="bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm hover:bg-purple-100 transition-colors">
                          <FileText size={16} className="inline mr-1" />
                          Records
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Diet Plan:</div>
                        <div className="text-sm font-medium">{pet.dietPlan}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );
        
      case 'vet':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Veterinary Services</h2>
              <p className="text-blue-100">Book appointments with verified vets</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800">Available Clinics</h3>
              
              {vetClinics.map(clinic => (
                <div key={clinic.id} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{clinic.name}</h4>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <MapPin size={12} />
                        {clinic.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{clinic.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Available Slots:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {clinic.slots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedVetSlot(`${clinic.name} - ${slot}`)}
                          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedVetSlot === `${clinic.name} - ${slot}` 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedVetSlot && selectedVetSlot.includes(clinic.name) && (
                    <button
                      onClick={() => {
                        alert(`Appointment booked for ${selectedVetSlot}!`);
                        setSelectedVetSlot(null);
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'volunteer':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Become a Volunteer</h2>
              <p className="text-purple-100">Join our rescue community</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                <Users size={32} className="text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Foster Care</h4>
                <p className="text-sm text-gray-600 mt-1">Provide temporary homes</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                <Heart size={32} className="text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Rescue Support</h4>
                <p className="text-sm text-gray-600 mt-1">Help with rescues</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                <Stethoscope size={32} className="text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Medical Aid</h4>
                <p className="text-sm text-gray-600 mt-1">Veterinary assistance</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                <MessageCircle size={32} className="text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Awareness</h4>
                <p className="text-sm text-gray-600 mt-1">Spread the word</p>
              </div>
            </div>
            
            <button
              onClick={() => alert('Volunteer application submitted! We will contact you soon.')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Apply as Volunteer
            </button>
          </div>
        );
        
      case 'chat':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl">
              <h2 className="text-lg font-bold">Live Chat Support</h2>
              <p className="text-green-100 text-sm">Connect with rescue teams</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg h-96 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with our rescue teams</p>
                  </div>
                ) : (
                  chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-2xl ${
                        message.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'donate':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Support Rescue Operations</h2>
              <p className="text-yellow-100">Your donation helps save lives</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Make a Donation</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['100', '500', '1000'].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`p-3 rounded-xl font-semibold transition-colors ${
                      donationAmount === amount 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              />
              
              <button
                onClick={handleDonation}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
              >
                <DollarSign size={16} className="inline mr-2" />
                Donate ₹{donationAmount || '0'}
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Where Your Money Goes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Care</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Food & Shelter</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rescue Operations</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Administration</span>
                  <span className="font-semibold">5%</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
            
            {notifications.map(notification => (
              <div key={notification.id} className={`bg-white rounded-2xl shadow-lg p-4 border-l-4 ${
                notification.type === 'adoption' ? 'border-green-500' :
                notification.type === 'health' ? 'border-blue-500' : 'border-red-500'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'more':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800">More Options</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentTab('donate')}
                className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-center hover:bg-orange-100 transition-colors"
              >
                <DollarSign size={32} className="text-orange-600 mx-auto mb-2" />
                <span className="text-orange-700 font-semibold">{t.donate}</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('chat')}
                className="bg-green-50 border border-green-200 p-4 rounded-xl text-center hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={32} className="text-green-600 mx-auto mb-2" />
                <span className="text-green-700 font-semibold">{t.chat}</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('volunteer')}
                className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors"
              >
                <Users size={32} className="text-purple-600 mx-auto mb-2" />
                <span className="text-purple-700 font-semibold">{t.volunteer}</span>
              </button>
              
              <button className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center hover:bg-indigo-100 transition-colors">
                <Camera size={32} className="text-indigo-600 mx-auto mb-2" />
                <span className="text-indigo-700 font-semibold">{t.scanBreed}</span>
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">App Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Language</span>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                    className="bg-gray-100 px-4 py-2 rounded-lg text-sm"
                  >
                    {language === 'en' ? 'English' : 'தமிழ்'}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Push Notifications</span>
                  <button className="bg-green-100 px-4 py-2 rounded-lg text-sm text-green-700">
                    Enabled
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Location Services</span>
                  <button className="bg-blue-100 px-4 py-2 rounded-lg text-sm text-blue-700">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header />
        
        <div className="p-4 pb-20">
          {renderTab()}
        </div>
        
        <TabBar />
      </div>
    </div>
  );
};

export default NaesamPetsApp;
