import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, X, Upload, Edit3, Compass } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const AdminManageTours = () => {
  const [tours, setTours] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTourId, setEditTourId] = useState(null);

  const [formData, setFormData] = useState({
    title: "", location: "", duration: "", city: "Jaipur", image: "", description: "", inclusions: ""
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tours`);
      setTours(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour package?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/tours/${id}`);
        fetchTours();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ title: "", location: "", duration: "", city: "Jaipur", image: "", description: "", inclusions: "" });
    setShowModal(true);
  };

  const openEditModal = (tour) => {
    setIsEditing(true);
    setEditTourId(tour._id);
    setFormData({
      title: tour.title || "",
      location: tour.location || "",
      duration: tour.duration || "",
      city: tour.city || "Jaipur",
      image: tour.image || "",
      description: tour.description || "",
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(", ") : (tour.inclusions || "")
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^\w ]/g, '').replace(/[\s_-]+/g, '-') + '-' + Date.now().toString().slice(-4),
        inclusions: formData.inclusions.split(",").map(i => i.trim()).filter(Boolean)
      };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/tours/${editTourId}`, payload);
        alert("Tour updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/tours`, payload);
        alert("Tour created successfully!");
      }
      setShowModal(false);
      fetchTours();
    } catch (err) {
      alert("Error saving tour package");
    }
  };

  const filteredTours = selectedCity === "All" ? tours : tours.filter(t => (t.city || "Jaipur") === selectedCity);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">Manage Tour Packages</h1>
          <p className="text-xs text-slate-400 font-medium">Add, edit or remove sightseeing packages</p>
        </div>
        <button onClick={openAddModal} className="bg-[#34A99D] hover:bg-[#2c8d83] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition">
          <PlusCircle size={15} /> Add New Tour
        </button>
      </div>

      {/* City Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", "Jaipur", "Sikar", "Udaipur", "Jodhpur", "Pushkar"].map((city) => (
          <button 
            key={city} 
            onClick={() => setSelectedCity(city)} 
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
              selectedCity === city ? "bg-[#34A99D] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:border-[#34A99D]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Tour Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <div key={tour._id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 right-3 bg-[#FFF3C8] text-[#458393] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                  {tour.city || "Jaipur"}
                </span>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">{tour.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 font-medium"><strong>Spots:</strong> {tour.location}</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Duration: {tour.duration}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button onClick={() => openEditModal(tour)} className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer">
                    <Edit3 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDeleteTour(tour._id)} className="bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs sm:text-sm font-medium">No tour packages found for this category.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2.5">
              <h2 className="text-base sm:text-lg font-black text-[#458393]">
                {isEditing ? "Edit Tour Package ✏️" : "Add Destination Tour 🚀"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Tour Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
                  placeholder="e.g. Amer Fort & City Palace Sightseeing"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">City / Region</label>
                  <select 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 bg-white font-medium focus:outline-none focus:border-[#34A99D]"
                  >
                    <option value="Jaipur">Jaipur</option>
                    <option value="Sikar">Sikar</option>
                    <option value="Udaipur">Udaipur</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Pushkar">Pushkar</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Duration</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
                    placeholder="e.g. 1 Full Day"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Spots Covered (Location)</label>
                <input 
                  type="text" 
                  required 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
                  placeholder="e.g. Hawa Mahal, Jantar Mantar, Amer Fort"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Tour Image URL / Upload</label>
                <div className="space-y-2 mt-1">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 p-2.5 rounded-xl cursor-pointer text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition">
                    <Upload size={14} className="text-[#34A99D]" /> <span>Upload Device Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <input 
                    type="url" 
                    value={formData.image.startsWith("data:image") ? "" : formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#34A99D]" 
                    placeholder="Or paste image URL here" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Description</label>
                <textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 h-16 font-medium focus:outline-none focus:border-[#34A99D]"
                  placeholder="Write tour details..."
                ></textarea>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Inclusions (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.inclusions} 
                  onChange={e => setFormData({...formData, inclusions: e.target.value})} 
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs mt-1 font-medium focus:outline-none focus:border-[#34A99D]" 
                  placeholder="AC Cab, Driver Allowance, Sightseeing"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 py-3 rounded-2xl font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#34A99D] hover:bg-[#2c8d83] text-white py-3 rounded-2xl font-bold text-xs cursor-pointer transition shadow-xs"
                >
                  {isEditing ? "Update Tour" : "Save Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminManageTours;