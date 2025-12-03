import React, { useState, useEffect } from 'react';
import { Heart, Camera, Calendar, Phone, MapPin, Search, User, Home, Plus, Bell, Shield, Stethoscope, FileText, Globe } from 'lucide-react';

const NaesamPetsApp = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
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
      emergency: false
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
      emergency: true
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
      emergency: false
    }
  ];

  const translations = {
    en: {
      appName: 'Naesam Pets',
      tagline: 'Ethical Rescue & Adoption',
      home: 'Home',
      adopt: 'Adopt',
      myPets: 'My Pets',
      profile: 'Profile',
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
      freeEthical: '100% Free & Ethical'
    },
    ta: {
      appName: 'நேசம் பெட்ஸ்',
      tagline: 'நெறிமுறை காப்பு & தத்தெடுப்பு',
      home: 'முகப்பு',
      adopt: 'தத்தெடுக்க',
      myPets: 'என் செல்லப்பிராணிகள்',
      profile: 'சுயவிவரம்',
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
    // Simulate user login
    setUser({ name: 'Priya Kumar', verified: true });
  }, []);

  const handleAdoptPet = (pet) => {
    setMyPets([...myPets, { ...pet, adoptedDate: new Date().toLocaleDateString(), healthUpdates: [] }]);
    alert(Adoption request submitted for ${pet.name}! Rescue team will contact you soon.);
  };

  const filteredPets = rescuePets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {[
          { id: 'home', icon: Home, label: t.home },
          { id: 'adopt', icon: Heart, label: t.adopt },
          { id: 'scan', icon: Camera, label: 'Scan' },
          { id: 'myPets', icon: User, label: t.myPets },
          { id: 'profile', icon: User, label: t.profile }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentTab === tab.id ? 'text-green-600 bg-green-50' : 'text-gray-600'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-xs mt-1">{tab.label}</span>
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
          <Bell size={24} />
        </div>
      </div>
      {user && (
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

  const PetCard = ({ pet, showAdoptButton = true }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{pet.image}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
            <p className="text-gray-600 text-sm">{pet.breed}</p>
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
              <Phone size={12} className="text-red-600" />
              <span className="text-xs text-red-700">{t.emergency}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t.age}:</span>
          <span className="font-medium">{pet.age}</span>
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
          <span className="text-gray-600">{t.medicalStatus}:</span>
          <span className="font-medium text-blue-600">{pet.medicalStatus}</span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 italic">"{pet.story}"</p>
      
      {showAdoptButton && (
        <button
          onClick={() => handleAdoptPet(pet)}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
        >
          <Heart size={16} className="inline mr-2" />
          {t.adoptMe}
        </button>
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
                onClick={() => setCurrentTab('scan')}
                className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors"
              >
                <Camera size={32} className="text-purple-600 mx-auto mb-2" />
                <span className="text-purple-700 font-semibold">{t.scanBreed}</span>
              </button>
              
              <button className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <Calendar size={32} className="text-blue-600 mx-auto mb-2" />
                <span className="text-blue-700 font-semibold">{t.bookVet}</span>
              </button>
              
              <button className="bg-red-50 border border-red-200 p-4 rounded-xl text-center hover:bg-red-100 transition-colors">
                <Phone size={32} className="text-red-600 mx-auto mb-2" />
                <span className="text-red-700 font-semibold">{t.emergency}</span>
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Rescues</h3>
              {rescuePets.slice(0, 2).map(pet => (
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
            
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{t.availableForAdoption}</h2>
              <span className="text-sm text-gray-600">{filteredPets.length} pets</span>
            </div>
            
            {filteredPets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        );
        
      case 'scan':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl">
              <Camera size={64} className="mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">{t.scanBreed}</h2>
              <p className="text-purple-100">AI-powered breed identification</p>
            </div>
            
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12">
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Tap to take a photo</p>
              <p className="text-sm text-gray-500 mt-2">Our AI will identify your pet's breed</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
              <Camera size={16} className="inline mr-2" />
              Open Camera
            </button>
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
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                          <Stethoscope size={16} className="inline mr-1" />
                          Health
                        </button>
                        <button className="bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm hover:bg-green-100 transition-colors">
                          <Calendar size={16} className="inline mr-1" />
                          Vet
                        </button>
                        <button className="bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm hover:bg-purple-100 transition-colors">
                          <FileText size={16} className="inline mr-1" />
                          Records
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );
        
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Shield size={16} className="text-green-600" />
                  <span className="text-sm text-green-600">Verified Adopter</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Pets Adopted</span>
                  <span className="font-semibold text-green-600">{myPets.length}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold">{language === 'en' ? 'English' : 'தமிழ்'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Emergency Contact</span>
                  <Phone size={20} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl">
              <h3 className="font-bold mb-2">Thank you for choosing ethical adoption!</h3>
              <p className="text-green-100 text-sm">You're helping end illegal pet trade and supporting rescued animals.</p>
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