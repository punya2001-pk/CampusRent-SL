import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Home, CheckCircle2, PlusCircle, X } from 'lucide-react';

export default function App() {
  const [boardings, setBoardings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new listing
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    distance: '',
    price: '',
    type: 'Single',
    gender: 'Boys',
    phone: '',
    features: '',
    image: ''
  });

  // Fetch listings from Node.js backend
  useEffect(() => {
    fetch('http://localhost:5000/api/boardings')
      .then(res => res.json())
      .then(data => setBoardings(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Filter listings based on search and selected type
  const filteredBoardings = boardings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Handle new listing submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim())
    };

    fetch('http://localhost:5000/api/boardings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    })
      .then(res => res.json())
      .then(newListing => {
        setBoardings([newListing, ...boardings]);
        setIsModalOpen(false);
        setFormData({ title: '', location: '', distance: '', price: '', type: 'Single', gender: 'Boys', phone: '', features: '', image: '' });
      })
      .catch(err => console.error("Error creating listing:", err));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-7 w-7 text-yellow-400" />
            <h1 className="text-xl font-bold">CampusRent SL</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Add Listing
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search location, place name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Single', 'Shared'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  selectedType === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Boardings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoardings.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img src={item.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-xs flex items-center mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {item.location} ({item.distance})
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-700">Rs. {Number(item.price).toLocaleString()}</span>
                  <a
                    href={`https://wa.me/${item.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                  >
                    Contact Landlord
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Boarding Listing</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Location (e.g. Pambaimadu)" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Distance to Campus (e.g. 500m)" required value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="number" placeholder="Monthly Price (LKR)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Phone Number (e.g. 94716957954)" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="text" placeholder="Features (comma separated: Wi-Fi, A/C)" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              <input type="url" placeholder="Image URL (optional)" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />

              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-blue-700">
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}