import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from './Testimonials';
import TourList from './TourList';
import { Car, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const previewCabs = [
    {
      name: 'Sedan',
      desc: 'Comfortable & spacious for family trips',
      price: '₹14/km',
      seats: '4 Seats',
      image: 'https://stimg.cardekho.com/images/car-images/930x620/Hyundai/Verna/13312/1773044789369/Atlas-White-with-Black-Roof_a5abb3.jpg'
    },
    {
      name: 'SUV (Ertiga / Innova)',
      desc: 'Spacious for group travel & outstation',
      price: '₹19/km',
      seats: '6-7 Seats',
      image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Innova-Crysta/11703/1780562393141/front-left-side-47.jpg'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans relative overflow-hidden">
      
      {/* Background Soft Glows for Seamless Section Blending */}
      <div className="absolute top-40 left-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-[#34A99D]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-[40%] right-0 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#E5CB90]/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Banner Top Par */}
      <section className="relative w-full">
        <Hero />
      </section>

      {/* Featured Tours Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-10">
        <TourList isHomePage={true} />
      </section>

      {/* CAB SERVICES HIGHLIGHT SECTION ON HOME PAGE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#34A99D]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <span className="bg-[#FFF3C8] text-[#458393] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-block shadow-xs">
                Safe & Reliable Rides
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Looking for Comfort Cab Services?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                Book local city rides, outstation cabs, or airport transfers instantly with verified drivers and best transparent rates.
              </p>
              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#34A99D]" /> Verified Drivers</span>
                <span className="flex items-center gap-1.5"><Car size={15} className="text-[#E5CB90]" /> Clean & Sanitized Cabs</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
              {previewCabs.map((cab, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full sm:w-48 space-y-2 flex flex-col justify-between">
                  <div className="h-20 bg-slate-800 rounded-xl overflow-hidden">
                    <img src={cab.image} alt={cab.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs">{cab.name}</h4>
                    <p className="text-[10px] text-[#FFF3C8] font-bold mt-0.5">{cab.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-medium">Choose from Hatchbacks, Sedans, SUVs and Tempo Travellers.</p>
            <button
              onClick={() => navigate('/cabs')}
              className="w-full sm:w-auto bg-[#34A99D] hover:bg-[#2c8d83] text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All Cab Services</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* Landing Page Sections with Seamless Stacking */}
      <section className="relative z-10 space-y-6 sm:space-y-12">
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
      </section>

    </div>
  );
};

export default Home;