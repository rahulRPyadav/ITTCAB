import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, 
  ArrowRight, Clock, User, Mail, Phone, Edit3, Check, Car
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const BookCab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Available fleet list for changing car in step 2
  const cabFleets = [
    {
      name: 'Hatchback',
      desc: 'Budget friendly for short rides & city travel',
      seats: '4 Seats',
      bags: '2 Bags',
      price: '₹11/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Maruti/Swift/9226/1747045535143/230_Pearl-Arctic-White_e8e8e8.jpg'
    },
    {
      name: 'Sedan',
      desc: 'Comfortable & spacious for family trips',
      seats: '4 Seats',
      bags: '3 Bags',
      price: '₹14/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Hyundai/Verna/13312/1773044789369/Atlas-White-with-Black-Roof_a5abb3.jpg'
    },
    {
      name: 'SUV (Ertiga / Innova)',
      desc: 'Spacious for group travel & outstation',
      seats: '6-7 Seats',
      bags: '4 Bags',
      price: '₹19/km',
      image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Innova-Crysta/11703/1780562393141/front-left-side-47.jpg'
    },
    {
      name: 'Tempo Traveller',
      desc: 'Best for large family groups & corporate tours',
      seats: '9-20 Seats',
      bags: 'Large Luggage',
      price: '₹26/km',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Force/Urbania/11850/Force-Urbania-3350WB-11Str/1721192002774/222_White_cdd5d5.jpg'
    }
  ];

  const [selectedCab, setSelectedCab] = useState(location.state?.cab || cabFleets[1]);

  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState('one-way');
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [drop, setDrop] = useState(location.state?.drop || '');
  const [date, setDate] = useState(location.state?.date || '');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('');
  
  // Passenger Form States
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const estimatedFare = 4999;

  const handleNext = (e) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim() || !date) {
      alert('Please fill in all the required trip details.');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      submitBooking();
    }
  };

  const submitBooking = async () => {
    if (!userName.trim() || !phone.trim() || !email.trim()) {
      alert('Please enter your Name, Email, and Phone Number.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/cab-bookings`, {
        userName,
        email,
        phone,
        tripType,
        pickup,
        drop,
        date,
        time: time || '10:00 AM',
        passengers: Number(passengers) || 1,
        carName: selectedCab.name,
        estimatedFare
      });

      alert('Cab booking confirmed successfully! Sent to admin dashboard. 🎉');
      navigate('/');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to process booking. Please check server connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-16">
      
      {/* Top Banner Header */}
      <div 
        className="relative bg-cover bg-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-white overflow-hidden shadow-md"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(69, 131, 147, 0.85)), url('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80')` 
        }}
      >
        <div className="max-w-6xl mx-auto space-y-2 relative z-10">
          <p className="text-[11px] font-bold text-slate-300">Home &gt; Services &gt; Book Cab</p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Book Your Cab</h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">Fill in your travel details to secure your ride</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:-mt-8 relative z-20">
        
        {/* STEPS PROGRESS BAR */}
        <div className="bg-white rounded-3xl border border-slate-200/85 shadow-md p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            {[
              { num: 1, label: 'Trip Details' },
              { num: 2, label: 'Choose Car' },
              { num: 3, label: 'Passenger Info' }
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all ${
                  step === s.num 
                    ? 'bg-[#34A99D] text-white shadow-sm ring-4 ring-[#34A99D]/20' 
                    : step > s.num 
                    ? 'bg-[#458393] text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <Check size={15} /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-xs font-black mt-1.5 ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: FORM WIZARD */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/85 shadow-md p-5 sm:p-7 space-y-5">
            
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Trip & Route Details</h2>
                  <p className="text-xs text-slate-400 font-medium">Configure your travel itinerary accurately</p>
                </div>

                {/* Trip Type Selector */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/85">
                  {[
                    { id: 'one-way', label: 'One Way' },
                    { id: 'round', label: 'Round Trip' },
                    { id: 'hourly', label: 'Hourly Rental' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id)}
                      className={`py-2 rounded-xl text-xs font-black capitalize transition cursor-pointer ${
                        tripType === t.id ? 'bg-[#34A99D] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pickup Location *</label>
                    <div className="relative">
                      <MapPin size={15} className="text-[#34A99D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={pickup} 
                        onChange={(e) => setPickup(e.target.value)} 
                        required 
                        placeholder="Enter pickup city or airport"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Drop Destination *</label>
                    <div className="relative">
                      <MapPin size={15} className="text-[#458393] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={drop} 
                        onChange={(e) => setDrop(e.target.value)} 
                        required 
                        placeholder="Enter destination city"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Journey Date *</label>
                    <div className="relative">
                      <Calendar size={15} className="text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pickup Time</label>
                    <div className="relative">
                      <Clock size={15} className="text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        placeholder="e.g. 10:00 AM"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Number of Passengers</label>
                  <div className="relative">
                    <Users size={15} className="text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number" 
                      min="1" 
                      max="20"
                      value={passengers} 
                      onChange={(e) => setPassengers(e.target.value)} 
                      placeholder="Enter number of passengers (e.g. 2)"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-[42px] bg-gradient-to-r from-[#458393] to-[#34A99D] hover:from-[#34A99D] hover:to-[#458393] text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Choose Vehicle</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Select Your Vehicle</h2>
                  <p className="text-xs text-slate-400 font-medium">Choose the best car for your journey</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cabFleets.map((cab, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedCab(cab)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedCab.name === cab.name 
                          ? 'border-[#34A99D] bg-emerald-50/40 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="h-28 w-full bg-slate-100 rounded-xl overflow-hidden">
                        <img src={cab.image} alt={cab.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-black text-slate-900 text-xs sm:text-sm">{cab.name}</h3>
                        <span className="text-[11px] font-black text-[#34A99D] bg-white px-2.5 py-0.5 rounded-full border border-emerald-100">{cab.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{cab.desc}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 pt-2 border-t border-slate-200/60">
                        <span>{cab.seats}</span>
                        <span>{cab.bags}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-black text-xs cursor-pointer transition"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="w-1/2 bg-gradient-to-r from-[#458393] to-[#34A99D] text-white py-3 rounded-2xl font-black text-xs cursor-pointer shadow-md transition"
                  >
                    Next: Passenger Details
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Passenger Information</h2>
                  <p className="text-xs text-slate-400 font-medium">Enter your contact details to confirm the booking</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Your Full Name *</label>
                  <div className="relative">
                    <User size={15} className="text-[#34A99D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Yadav"
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="text-[#458393] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      placeholder="e.g. rahul@gmail.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Phone Number *</label>
                  <div className="relative">
                    <Phone size={15} className="text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 9876543210"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#34A99D]/40"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-black text-xs cursor-pointer transition"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-1/2 bg-gradient-to-r from-[#458393] to-[#34A99D] hover:from-[#34A99D] hover:to-[#458393] text-white py-3 rounded-2xl font-black text-xs cursor-pointer shadow-md transition disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking 🚀'}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-5">
            
            <div className="bg-white rounded-3xl border border-slate-200/85 shadow-md p-5 space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="font-black text-slate-900 text-sm">Your Trip Summary</h3>
                <button onClick={() => setStep(1)} className="text-xs font-black text-[#34A99D] flex items-center gap-1 hover:underline cursor-pointer">
                  <Edit3 size={12} /> Edit
                </button>
              </div>

              <div className="space-y-2.5 relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-slate-200">
                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-[#34A99D] ring-4 ring-emerald-50 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-slate-900">{pickup || 'Not specified'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Pickup Location</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-[#458393] ring-4 ring-cyan-50 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-slate-900">{drop || 'Not specified'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Drop Destination</p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#34A99D]" /> {date || 'Select date'}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#458393]" /> {time || '10:00 AM'}</span>
                <span className="flex items-center gap-1.5 col-span-2 pt-1"><Users size={13} className="text-amber-500" /> {passengers || '1'} Passenger(s) ({tripType.replace('-', ' ')})</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/85 shadow-md p-5 space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="font-black text-slate-900 text-sm">Selected Car</h3>
                <span onClick={() => setStep(2)} className="text-xs font-black text-[#34A99D] cursor-pointer hover:underline">Change</span>
              </div>

              <div className="h-28 bg-slate-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                <img src={selectedCab.image} alt={selectedCab.name} className="w-full h-full object-cover rounded-xl" />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 text-sm">{selectedCab.name}</span>
                <span className="text-[11px] font-bold text-slate-500">{selectedCab.seats} | AC</span>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                <span className="text-xs font-black text-slate-700">Estimated Fare</span>
                <span className="text-sm sm:text-base font-black text-slate-900">₹ {estimatedFare.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookCab;