import React, { useState } from 'react';
import { 
  Car, ShieldCheck, Headphones, MapPin, Calendar, Users, 
  ArrowRight, Clock, DollarSign, Sparkles, Navigation 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CabServices = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('one-way');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !drop) {
      alert('Please enter both pickup and drop locations.');
      return;
    }
    navigate('/book-cab', { state: { pickup, drop, date, tripType } });
  };

  const cabFleets = [
    {
      name: 'Hatchback',
      desc: 'Budget-friendly option for city travel and short rides.',
      seats: '4 Seats',
      bags: '2 Bags',
      price: '₹11/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Maruti/Swift/9226/1747045535143/230_Pearl-Arctic-White_e8e8e8.jpg'
    },
    {
      name: 'Sedan',
      desc: 'Comfortable and spacious choice for family trips.',
      seats: '4 Seats',
      bags: '3 Bags',
      price: '₹14/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Hyundai/Verna/13312/1773044789369/Atlas-White-with-Black-Roof_a5abb3.jpg'
    },
    {
      name: 'SUV (Ertiga / Innova)',
      desc: 'Spacious vehicle for group travel and outstation trips.',
      seats: '6-7 Seats',
      bags: '4 Bags',
      price: '₹19/km',
      image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Innova-Crysta/11703/1780562393141/front-left-side-47.jpg'
    },
    {
      name: 'Tempo Traveller',
      desc: 'Best for large family gatherings and corporate tours.',
      seats: '9-20 Seats',
      bags: 'Large Luggage',
      price: '₹26/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Force/Urbania/11850/Force-Urbania-3350WB-11Str/1721192002774/222_White_cdd5d5.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-10">
      
      {/* 1. HERO BANNER SECTION WITH BOOKING WIDGET */}
      <div 
        className="relative bg-cover bg-center py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-white overflow-hidden shadow-md"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(69, 131, 147, 0.85)), url('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80')` 
        }}
      >
        <div className="max-w-6xl mx-auto space-y-3 relative z-10">
          
          <div className="inline-flex items-center gap-1.5 bg-[#FFF3C8] text-[#458393] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-2xs">
            <Sparkles size={12} className="text-[#34A99D]" />
            Travel Anywhere With Comfort
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Reliable Cab Services for <br />
            <span className="bg-gradient-to-r from-[#FFF3C8] via-[#E5CB90] to-[#34A99D] bg-clip-text text-transparent">
              Every Journey
            </span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
            Local city rides, outstation trips, airport transfers, and more — safe, affordable, and always on time.
          </p>

          {/* BOOKING WIDGET BAR */}
          <div className="bg-white rounded-3xl p-4 sm:p-4 shadow-xl border border-slate-200/80 text-slate-900 mt-4">
            
            {/* Trip Type Tabs */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'one-way', label: 'One Way' },
                { id: 'round', label: 'Round Trip' },
                { id: 'hourly', label: 'Hourly Rental' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTripType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                    tripType === tab.id
                      ? 'bg-[#34A99D] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Pickup Location</label>
                <div className="relative">
                  <MapPin size={15} className="text-[#34A99D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter pickup city or airport"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Drop Destination</label>
                <div className="relative">
                  <Navigation size={15} className="text-[#458393] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter destination city"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Journey Date</label>
                <div className="relative">
                  <Calendar size={15} className="text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[38px] bg-gradient-to-r from-[#458393] to-[#34A99D] hover:from-[#34A99D] hover:to-[#458393] text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Search Cabs</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      {/* 2. TRUST BADGES STRIP */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: ShieldCheck, title: 'Safe & Secure', desc: 'Verified drivers & clean cabs' },
            { icon: DollarSign, title: 'Affordable Pricing', desc: 'Best rates with no hidden fees' },
            { icon: Headphones, title: '24/7 Support', desc: 'Assistance throughout your trip' },
            { icon: MapPin, title: 'Wide Coverage', desc: 'Available across Rajasthan' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-1">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF3C8] text-[#458393] flex items-center justify-center font-black shrink-0 shadow-2xs">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. OUR CAB FLEET SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#458393]">Our Fleet</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Cab Service</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Select the right vehicle for your solo, family, or group trip</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cabFleets.map((cab, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md p-4 flex flex-col justify-between space-y-3 transition group">
              <div className="space-y-2.5">
                <div className="h-32 w-full bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-2">
                  <img src={cab.image} alt={cab.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 rounded-xl" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 text-sm">{cab.name}</h3>
                  <span className="text-[11px] font-black text-[#34A99D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">{cab.price}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{cab.desc}</p>
              </div>

              <div className="space-y-2.5 pt-2.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1"><Users size={12} className="text-[#34A99D]" /> {cab.seats}</span>
                  <span className="flex items-center gap-1"><Car size={12} className="text-[#458393]" /> {cab.bags}</span>
                </div>

                <button 
                  onClick={() => navigate('/book-cab', { state: { cab } })}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-[#34A99D] text-white py-2 rounded-xl font-black text-xs transition cursor-pointer shadow-2xs"
                >
                  <span>Book Now</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HOW IT WORKS */}
      <div className="bg-white py-10 sm:py-12 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#458393]">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Book your ride in just a few quick steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { step: '1', title: 'Search', desc: 'Enter your pickup and drop locations.' },
              { step: '2', title: 'Choose', desc: 'Select your preferred vehicle type.' },
              { step: '3', title: 'Book & Pay', desc: 'Confirm your booking instantly.' },
              { step: '4', title: 'Ride', desc: 'Enjoy a safe and comfortable journey.' }
            ].map((st, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 space-y-2 relative shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3C8] text-[#458393] font-black text-xs flex items-center justify-center mx-auto shadow-2xs">
                  {st.step}
                </div>
                <h3 className="font-black text-slate-900 text-xs">{st.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CabServices;