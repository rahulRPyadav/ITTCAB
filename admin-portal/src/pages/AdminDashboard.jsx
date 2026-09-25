// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import {
//   Compass, CalendarCheck, PlusCircle, Trash2, X, Upload,
//   LogOut, ExternalLink, Edit3, Filter, Calendar as CalendarIcon,
//   CheckCircle2, XCircle, Clock, Phone, Mail, Users, Heart, Car
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL, FRONTEND_URL } from "../config/api";

// const AdminDashboard = () => {
//   const [tours, setTours] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [cabBookings, setCabBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState(() => localStorage.getItem("adminActiveTab") || "bookings");
  
//   // Filters for Leads
//   const [timeFilter, setTimeFilter] = useState("all"); 
//   const [statusFilter, setStatusFilter] = useState("all"); 
  
//   // Filters for Tours
//   const [selectedAdminCity, setSelectedAdminCity] = useState("All");

//   // Modal & Edit state for Tours
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTourId, setEditTourId] = useState(null);

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "", location: "", duration: "", city: "Jaipur", image: "", description: "", inclusions: ""
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     localStorage.setItem("adminActiveTab", tab);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminUser");
//     navigate("/admin-login");
//   };

//   const fetchData = async () => {
//     try {
//       const tourRes = await axios.get(`${API_BASE_URL}/api/tours`).catch(() => ({ data: [] }));
//       const bookingRes = await axios.get(`${API_BASE_URL}/api/bookings`).catch(() => ({ data: [] }));
//       const cabRes = await axios.get(`${API_BASE_URL}/api/cab-bookings`).catch(() => ({ data: { data: [] } }));
      
//       setTours(tourRes.data.data || tourRes.data || []);
//       setBookings(bookingRes.data.data || bookingRes.data || []);
//       setCabBookings(cabRes.data.data || cabRes.data || []);
//     } catch (err) {
//       console.error("Error fetching admin data:", err);
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       await axios.put(`${API_BASE_URL}/api/bookings/${id}/status`, { status });
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteBooking = async (id, customerName) => {
//     if (window.confirm(`Are you sure you want to permanently delete lead for "${customerName}"?`)) {
//       try {
//         await axios.delete(`${API_BASE_URL}/api/bookings/${id}`);
//         fetchData();
//       } catch (err) {
//         alert("Delete Error: " + (err.response?.data?.message || err.message));
//       }
//     }
//   };

//   const handleDeleteTour = async (id) => {
//     if (window.confirm("Are you sure you want to permanently delete this tour package?")) {
//       try {
//         await axios.delete(`${API_BASE_URL}/api/tours/${id}`);
//         fetchData();
//       } catch (err) {
//         console.error("Delete Error:", err);
//       }
//     }
//   };

//   const openAddTourModal = () => {
//     setIsEditing(false);
//     setEditTourId(null);
//     setFormData({
//       title: "", location: "", duration: "", city: "Jaipur", image: "", description: "", inclusions: ""
//     });
//     setShowModal(true);
//   };

//   const openEditTourModal = (tour) => {
//     setIsEditing(true);
//     setEditTourId(tour._id);
//     setFormData({
//       title: tour.title || "",
//       location: tour.location || "",
//       duration: tour.duration || "",
//       city: tour.city || "Jaipur",
//       image: tour.image || "",
//       description: tour.description || "",
//       inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(", ") : (tour.inclusions || "")
//     });
//     setShowModal(true);
//   };

//   const handleTourFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.image) return alert("Please select or paste a tour image");

//     try {
//       const titleSlug = formData.title 
//         ? formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') 
//         : "tour";
//       const uniqueSlug = `${titleSlug}-${Date.now().toString().slice(-4)}`;

//       const payload = {
//         title: formData.title.trim(),
//         slug: uniqueSlug,
//         location: formData.location.trim(),
//         duration: formData.duration.trim(),
//         city: formData.city || "Jaipur",
//         image: formData.image,
//         description: formData.description.trim(),
//         inclusions: formData.inclusions ? formData.inclusions.split(",").map((item) => item.trim()).filter(Boolean) : []
//       };

//       if (isEditing) {
//         await axios.put(`${API_BASE_URL}/api/tours/${editTourId}`, payload);
//         alert("Tour package updated successfully! ✅");
//       } else {
//         await axios.post(`${API_BASE_URL}/api/tours`, payload);
//         alert("Tour package created successfully! 🚀");
//       }

//       setShowModal(false);
//       setFormData({
//         title: "", location: "", duration: "", city: "Jaipur", image: "", description: "", inclusions: ""
//       });
//       fetchData();
//     } catch (err) {
//       console.error("Backend validation error response:", err.response?.data);
//       alert("Error: " + (err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || err.message));
//     }
//   };

//   const filteredBookings = useMemo(() => {
//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
//     const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
//     const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;

//     return bookings.filter((b) => {
//       if (statusFilter !== "all" && b.status !== statusFilter) {
//         return false;
//       }
//       if (timeFilter !== "all") {
//         const itemDate = new Date(b.createdAt || b.travelDate).getTime();
//         if (isNaN(itemDate)) return true;
//         if (timeFilter === "today" && itemDate < todayStart) return false;
//         if (timeFilter === "week" && itemDate < sevenDaysAgo) return false;
//         if (timeFilter === "month" && itemDate < thirtyDaysAgo) return false;
//       }
//       return true;
//     });
//   }, [bookings, timeFilter, statusFilter]);

//   const filteredAdminTours = selectedAdminCity === "All"
//     ? tours
//     : tours.filter((t) => (t.city || "Jaipur") === selectedAdminCity);

//   return (
//     <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
//       {/* 1. FIXED TOP NAVBAR */}
//       <header className="bg-[#0F172A] text-white px-4 sm:px-8 py-3.5 flex justify-between items-center z-40 shadow-sm shrink-0 w-full">
//         <div className="flex items-center gap-2">
//           <span className="font-black text-xs sm:text-sm tracking-wide">Ishika Admin Control</span>
//           <span className="bg-[#FFF3C8] text-[#458393] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Live</span>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3">
//           <a 
//             href={FRONTEND_URL || "http://localhost:5173"} 
//             target="_blank" 
//             rel="noreferrer" 
//             className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition"
//           >
//             <span>View Site</span> <ExternalLink size={13} />
//           </a>
//           <button onClick={handleLogout} className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer">
//             <LogOut size={12} /> <span className="hidden sm:inline">Logout</span>
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden w-full">
        
//         {/* 2. FIXED DESKTOP SIDEBAR WITH CAB SERVICES TAB */}
//         <aside className="w-64 bg-[#0F172A] text-slate-300 p-5 hidden md:flex flex-col justify-start border-r border-white/10 shrink-0 h-full">
//           <nav className="flex flex-col gap-2">
//             <button onClick={() => handleTabChange("bookings")} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full text-left transition cursor-pointer ${activeTab === "bookings" ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
//               <CalendarCheck size={16} /> Tour Leads ({bookings.length})
//             </button>
//             <button onClick={() => handleTabChange("cabBookings")} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full text-left transition cursor-pointer ${activeTab === "cabBookings" ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
//               <Car size={16} /> Cab Bookings ({cabBookings.length})
//             </button>
//             <button onClick={() => handleTabChange("tours")} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full text-left transition cursor-pointer ${activeTab === "tours" ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
//               <Compass size={16} /> Destination Tours ({tours.length})
//             </button>
//           </nav>
//         </aside>

//         {/* 3. MAIN CONTENT CONTAINER */}
//         <main className="flex-1 flex flex-col h-full overflow-hidden justify-between">
          
//           <div className="p-3.5 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto flex flex-col h-full overflow-hidden">
            
//             {/* MOBILE TAB SELECTOR */}
//             <div className="flex md:hidden gap-1 mb-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0 overflow-x-auto scrollbar-none">
//               <button onClick={() => handleTabChange("bookings")} className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold shrink-0 ${activeTab === "bookings" ? "bg-[#34A99D] text-white" : "text-slate-600"}`}>
//                 Leads ({bookings.length})
//               </button>
//               <button onClick={() => handleTabChange("cabBookings")} className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold shrink-0 ${activeTab === "cabBookings" ? "bg-[#34A99D] text-white" : "text-slate-600"}`}>
//                 Cabs ({cabBookings.length})
//               </button>
//               <button onClick={() => handleTabChange("tours")} className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold shrink-0 ${activeTab === "tours" ? "bg-[#34A99D] text-white" : "text-slate-600"}`}>
//                 Tours ({tours.length})
//               </button>
//             </div>

//             {/* TAB 1: CUSTOMER TOUR BOOKING LEADS */}
//             {activeTab === "bookings" && (
//               <div className="w-full flex flex-col h-full overflow-hidden">
                
//                 <div className="shrink-0 bg-[#F8FAFC] pb-2 z-10">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
//                     <div>
//                       <h1 className="text-base sm:text-xl font-black text-slate-900">
//                         Customer Tour Inquiries & Leads
//                       </h1>
//                       <p className="text-xs text-slate-400 font-medium mt-0.5">
//                         Showing {filteredBookings.length} of {bookings.length} total tour leads
//                       </p>
//                     </div>
//                   </div>

//                   {/* FILTER CONTROLS */}
//                   <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
//                     <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
//                       <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
//                         <Clock size={12} /> Time:
//                       </span>
//                       {[
//                         { id: "all", label: "All Time" },
//                         { id: "today", label: "Today" },
//                         { id: "week", label: "This Week" },
//                         { id: "month", label: "This Month" },
//                       ].map((t) => (
//                         <button
//                           key={t.id}
//                           onClick={() => setTimeFilter(t.id)}
//                           className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
//                             timeFilter === t.id
//                               ? "bg-[#34A99D] text-white shadow-xs"
//                               : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
//                           }`}
//                         >
//                           {t.label}
//                         </button>
//                       ))}
//                     </div>

//                     <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
//                       <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
//                         <Filter size={12} /> Status:
//                       </span>
//                       {[
//                         { id: "all", label: "All Status" },
//                         { id: "Pending", label: "Pending" },
//                         { id: "Confirmed", label: "Confirmed" },
//                         { id: "Cancelled", label: "Cancelled" },
//                       ].map((s) => (
//                         <button
//                           key={s.id}
//                           onClick={() => setStatusFilter(s.id)}
//                           className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
//                             statusFilter === s.id
//                               ? "bg-[#0F172A] text-white shadow-xs"
//                               : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
//                           }`}
//                         >
//                           {s.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto pb-4 pr-1">
//                   {filteredBookings.length === 0 ? (
//                     <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 mt-2">
//                       <p className="text-slate-400 text-xs sm:text-sm font-medium">No tour leads match the selected filter criteria.</p>
//                     </div>
//                   ) : (
//                     <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto w-full mb-6">
//                       <table className="w-full text-left text-xs min-w-[760px]">
//                         <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-100 sticky top-0 z-10">
//                           <tr>
//                             <th className="p-3.5 bg-slate-50">Tour Destination</th>
//                             <th className="p-3.5 bg-slate-50">Customer</th>
//                             <th className="p-3.5 bg-slate-50">Contact</th>
//                             <th className="p-3.5 bg-slate-50">Travel Date</th>
//                             <th className="p-3.5 bg-slate-50">Guests</th>
//                             <th className="p-3.5 bg-slate-50">Status</th>
//                             <th className="p-3.5 bg-slate-50 text-right">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                           {filteredBookings.map((b) => (
//                             <tr key={b._id} className="hover:bg-slate-50/80 transition">
//                               <td className="p-3.5 font-bold text-slate-900 max-w-[200px] truncate">{b.tourName}</td>
//                               <td className="p-3.5 font-semibold text-slate-700">{b.customerName}</td>
//                               <td className="p-3.5">
//                                 <div className="font-bold text-slate-900">{b.phone}</div>
//                                 <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{b.email}</div>
//                               </td>
//                               <td className="p-3.5 text-slate-600">{b.travelDate}</td>
//                               <td className="p-3.5">
//                                 <span className="inline-flex items-center gap-1 bg-[#FFF3C8] text-[#458393] px-2 py-0.5 rounded text-[10px] font-black">
//                                   <Users size={10} /> {b.guests || 1}
//                                 </span>
//                               </td>
//                               <td className="p-3.5">
//                                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${b.status === "Confirmed" ? "bg-green-100 text-green-700" : b.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
//                                   {b.status}
//                                 </span>
//                               </td>
//                               <td className="p-3.5 text-right">
//                                 <div className="inline-flex items-center gap-1.5">
//                                   {b.status !== "Confirmed" && (
//                                     <button onClick={() => handleStatusChange(b._id, "Confirmed")} className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer">
//                                       Confirm
//                                     </button>
//                                   )}
//                                   {b.status !== "Cancelled" && (
//                                     <button onClick={() => handleStatusChange(b._id, "Cancelled")} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer">
//                                       Cancel
//                                     </button>
//                                   )}
//                                   <button 
//                                     onClick={() => handleDeleteBooking(b._id, b.customerName)} 
//                                     className="bg-red-50 hover:bg-red-600 text-red-500 hover:text-white p-1.5 rounded-lg transition cursor-pointer"
//                                     title="Permanent Delete Lead"
//                                   >
//                                     <Trash2 size={13} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//               </div>
//             )}

//             {/* TAB 2: CAB BOOKINGS (NEW ADDITION) */}
//             {activeTab === "cabBookings" && (
//               <div className="w-full flex flex-col h-full overflow-hidden">
//                 <div className="shrink-0 bg-[#F8FAFC] pb-2 z-10">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
//                     <div>
//                       <h1 className="text-base sm:text-xl font-black text-slate-900">Cab Service Bookings</h1>
//                       <p className="text-xs text-slate-400 font-medium mt-0.5">Showing all vehicle bookings and customer details</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto pb-4 pr-1">
//                   {cabBookings.length === 0 ? (
//                     <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 mt-2">
//                       <p className="text-slate-400 text-xs sm:text-sm font-medium">No cab bookings received yet.</p>
//                     </div>
//                   ) : (
//                     <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto w-full mb-6">
//                       <table className="w-full text-left text-xs min-w-[760px]">
//                         <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-100 sticky top-0 z-10">
//                           <tr>
//                             <th className="p-3.5 bg-slate-50">Customer Details</th>
//                             <th className="p-3.5 bg-slate-50">Contact</th>
//                             <th className="p-3.5 bg-slate-50">Route (Pickup & Drop)</th>
//                             <th className="p-3.5 bg-slate-50">Car Booked</th>
//                             <th className="p-3.5 bg-slate-50">Schedule</th>
//                             <th className="p-3.5 bg-slate-50 text-right">Fare</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                           {cabBookings.map((cb) => (
//                             <tr key={cb._id} className="hover:bg-slate-50/80 transition">
//                               <td className="p-3.5 font-bold text-slate-900">{cb.userName}</td>
//                               <td className="p-3.5">
//                                 <div className="font-bold text-slate-900">{cb.phone}</div>
//                                 <div className="text-[10px] text-slate-400">{cb.email}</div>
//                               </td>
//                               <td className="p-3.5 font-medium text-slate-700">
//                                 <span className="font-bold text-[#34A99D]">{cb.pickup}</span> &rarr; <span className="font-bold text-[#458393]">{cb.drop}</span>
//                               </td>
//                               <td className="p-3.5">
//                                 <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold text-[11px]">
//                                   {cb.carName}
//                                 </span>
//                               </td>
//                               <td className="p-3.5 text-slate-600">
//                                 <p className="font-bold">{cb.date}</p>
//                                 <p className="text-[10px] text-slate-400">{cb.time}</p>
//                               </td>
//                               <td className="p-3.5 text-right font-black text-emerald-600 text-sm">
//                                 ₹ {cb.estimatedFare?.toLocaleString()}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* TAB 3: TOURS MANAGER */}
//             {activeTab === "tours" && (
//               <div className="w-full flex flex-col h-full overflow-hidden">
                
//                 <div className="shrink-0 bg-[#F8FAFC] pb-2 z-10">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
//                     <div>
//                       <h1 className="text-base sm:text-xl font-black text-slate-900">Manage Rajasthan Tours</h1>
//                       <p className="text-xs text-slate-400 font-medium mt-0.5">Add, Edit, and Manage Live Sightseeing Packages</p>
//                     </div>
//                     <button onClick={openAddTourModal} className="bg-[#34A99D] hover:bg-[#2c8d83] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm self-start sm:self-auto">
//                       <PlusCircle size={15} /> <span>Add New Tour</span>
//                     </button>
//                   </div>

//                   <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
//                     {["All", "Jaipur", "Sikar", "Udaipur", "Jodhpur", "Pushkar"].map((city) => (
//                       <button key={city} onClick={() => setSelectedAdminCity(city)} className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${selectedAdminCity === city ? "bg-[#34A99D] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:border-[#34A99D]"}`}>
//                         {city}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto pb-4 pr-1">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full pt-1">
//                     {filteredAdminTours.map((tour) => (
//                       <div key={tour._id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group w-full">
//                         <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
//                           <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
//                           <span className="absolute top-3 right-3 bg-[#FFF3C8] text-[#458393] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
//                             {tour.city || "Jaipur"}
//                           </span>
//                         </div>
                        
//                         <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
//                           <div>
//                             <h3 className="font-black text-slate-900 text-sm mb-1 truncate">{tour.title}</h3>
//                             <p className="text-xs text-slate-500 line-clamp-2 mb-2 font-medium leading-relaxed"><strong>Spots:</strong> {tour.location}</p>
//                             <p className="text-[11px] text-slate-400 font-semibold">Duration: {tour.duration}</p>
//                           </div>

//                           <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
//                             <button 
//                               onClick={() => openEditTourModal(tour)} 
//                               className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
//                             >
//                               <Edit3 size={13} /> Edit
//                             </button>
//                             <button 
//                               onClick={() => handleDeleteTour(tour._id)} 
//                               className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
//                             >
//                               <Trash2 size={13} /> Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             )}

//             {/* ADD / EDIT TOUR MODAL */}
//             {showModal && (
//               <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
//                 <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
//                   <div className="flex justify-between items-center mb-4 border-b pb-2.5">
//                     <h2 className="text-base sm:text-lg font-black text-[#458393]">
//                       {isEditing ? "Edit Tour Package ✏️" : "Add Destination Tour 🚀"}
//                     </h2>
//                     <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
//                       <X size={20} />
//                     </button>
//                   </div>
                  
//                   <form onSubmit={handleTourFormSubmit} className="space-y-3.5">
//                     <div>
//                       <label className="text-[10px] font-extrabold uppercase text-slate-500">Tour Title</label>
//                       <input 
//                         type="text" 
//                         required 
//                         value={formData.title} 
//                         onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
//                         className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
//                         placeholder="e.g. Khatu Shyam Ji & Jeen Mata Tour" 
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-[10px] font-extrabold uppercase text-slate-500">City / Region</label>
//                         <select 
//                           value={formData.city} 
//                           onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
//                           className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 bg-white font-medium focus:outline-none focus:border-[#34A99D]"
//                         >
//                           <option value="Jaipur">Jaipur (Pink City)</option>
//                           <option value="Sikar">Sikar & Shekhawati</option>
//                           <option value="Udaipur">Udaipur (Lake City)</option>
//                           <option value="Jodhpur">Jodhpur (Blue City)</option>
//                           <option value="Pushkar">Pushkar & Ajmer</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="text-[10px] font-extrabold uppercase text-slate-500">Duration</label>
//                         <input 
//                           type="text" 
//                           required 
//                           value={formData.duration} 
//                           onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
//                           className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
//                           placeholder="e.g. 1 Full Day / 5-6 Hrs" 
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-[10px] font-extrabold uppercase text-slate-500">Spots Covered</label>
//                       <input 
//                         type="text" 
//                         required 
//                         value={formData.location} 
//                         onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
//                         className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
//                         placeholder="e.g. Amer Fort, Jal Mahal, Hawa Mahal" 
//                       />
//                     </div>

//                     <div>
//                       <label className="text-[10px] font-extrabold uppercase text-slate-500">Tour Image</label>
//                       <div className="space-y-2 mt-1">
//                         <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 p-2.5 rounded-xl cursor-pointer text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition">
//                           <Upload size={14} className="text-[#34A99D]" /> <span>Upload New Device Image</span>
//                           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
//                         </label>
//                         <input 
//                           type="url" 
//                           value={formData.image.startsWith("data:image") ? "" : formData.image} 
//                           onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
//                           className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#34A99D]" 
//                           placeholder="Or paste image URL" 
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-[10px] font-extrabold uppercase text-slate-500">Description</label>
//                       <textarea 
//                         required 
//                         value={formData.description} 
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
//                         className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 h-16 font-medium focus:outline-none focus:border-[#34A99D]" 
//                         placeholder="Tour details & highlights..."
//                       ></textarea>
//                     </div>

//                     <div>
//                       <label className="text-[10px] font-extrabold uppercase text-slate-500">Inclusions (Comma separated)</label>
//                       <input 
//                         type="text" 
//                         value={formData.inclusions} 
//                         onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })} 
//                         className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
//                         placeholder="AC Cab, Toll, Parking, Driver Allowance" 
//                       />
//                     </div>

//                     <div className="pt-2 flex gap-2.5">
//                       <button 
//                         type="button" 
//                         onClick={() => setShowModal(false)} 
//                         className="w-1/2 bg-slate-100 hover:bg-slate-200 py-3 rounded-2xl font-bold text-xs cursor-pointer transition"
//                       >
//                         Cancel
//                       </button>
//                       <button 
//                         type="submit" 
//                         className="w-1/2 bg-[#34A99D] hover:bg-[#2c8d83] text-white py-3 rounded-2xl font-bold text-xs cursor-pointer transition shadow-xs"
//                       >
//                         {isEditing ? "Update Tour" : "Save Tour"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}

//           </div>

//           {/* 4. TRUE PAGE FOOTER AT THE VERY BOTTOM */}
//           <footer className="bg-[#0F172A] text-slate-400 border-t border-white/10 py-3 px-4 sm:px-8 shrink-0 w-full">
//             <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs">
//               <p className="font-medium">
//                 © {new Date().getFullYear()} Ishika Tour & Travels Admin Portal. All rights reserved.
//               </p>
//               <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl shadow-xs">
//                 <span className="text-slate-400 text-[11px] flex items-center gap-1">
//                   Crafted with <Heart size={11} className="text-red-500 fill-red-500 inline" /> by
//                 </span>
//                 <a 
//                   href="https://rahulrp.vercel.app/" 
//                   target="_blank" 
//                   rel="noreferrer"
//                   className="text-[#34A99D] hover:text-[#FFF3C8] font-black text-[11px] flex items-center gap-1 transition underline decoration-dotted underline-offset-2"
//                 >
//                   <span>Developer Portfolio</span>
//                   <ExternalLink size={10} />
//                 </a>
//               </div>
//             </div>
//           </footer>

//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Compass, CalendarCheck, Car, LogOut, ExternalLink } from 'lucide-react';
import { FRONTEND_URL } from '../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <header className="bg-[#0F172A] text-white px-4 sm:px-8 py-3.5 flex justify-between items-center z-40 shadow-sm shrink-0 w-full">
        <div className="flex items-center gap-2">
          <span className="font-black text-xs sm:text-sm tracking-wide">Ishika Admin Portal</span>
          <span className="bg-[#FFF3C8] text-[#458393] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Live</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href={FRONTEND_URL || "http://localhost:5173"} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition"
          >
            <span>View Site</span> <ExternalLink size={13} />
          </a>
          <button onClick={handleLogout} className="inline-flex items-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer">
            <LogOut size={12} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden w-full">
        
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#0F172A] text-slate-300 p-5 hidden md:flex flex-col justify-start border-r border-white/10 shrink-0 h-full space-y-2">
          <Link to="/admin/tour-leads" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full transition ${isActive('/admin/tour-leads') ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
            <CalendarCheck size={16} /> Tour Leads
          </Link>
          <Link to="/admin/cab-bookings" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full transition ${isActive('/admin/cab-bookings') ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
            <Car size={16} /> Cab Bookings
          </Link>
          <Link to="/admin/manage-tours" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs w-full transition ${isActive('/admin/manage-tours') ? "bg-[#34A99D] text-white" : "text-slate-400 hover:bg-white/5"}`}>
            <Compass size={16} /> Manage Tours
          </Link>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
          
          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden gap-1 p-3 bg-white border-b border-slate-200 shrink-0 overflow-x-auto">
            <Link to="/admin/tour-leads" className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold text-center shrink-0 ${isActive('/admin/tour-leads') ? "bg-[#34A99D] text-white" : "bg-slate-100 text-slate-600"}`}>
              Tour Leads
            </Link>
            <Link to="/admin/cab-bookings" className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold text-center shrink-0 ${isActive('/admin/cab-bookings') ? "bg-[#34A99D] text-white" : "bg-slate-100 text-slate-600"}`}>
              Cabs
            </Link>
            <Link to="/admin/manage-tours" className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold text-center shrink-0 ${isActive('/admin/manage-tours') ? "bg-[#34A99D] text-white" : "bg-slate-100 text-slate-600"}`}>
              Tours
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;