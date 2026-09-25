import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Phone, Mail, Car, Calendar as CalendarIcon, Clock, Users, ArrowRight, Filter, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const AdminCabBookings = () => {
  const [cabBookings, setCabBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [timeFilter, setTimeFilter] = useState("all");
  const [tripFilter, setTripFilter] = useState("all");
  const [carFilter, setCarFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCabBookings();
  }, []);

  const fetchCabBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cab-bookings`);
      setCabBookings(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching cab bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/cab-bookings/${id}/status`, { status });
      fetchCabBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteBooking = async (id, userName) => {
    if (window.confirm(`Are you sure you want to permanently delete cab booking for "${userName}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cab-bookings/${id}`);
        fetchCabBookings();
      } catch (err) {
        alert("Delete Error");
      }
    }
  };

  const filteredCabBookings = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;

    return cabBookings.filter((cb) => {
      if (statusFilter !== "all" && cb.status !== statusFilter) {
        return false;
      }
      if (tripFilter !== "all" && cb.tripType !== tripFilter) {
        return false;
      }
      if (carFilter !== "all" && cb.carName !== carFilter) {
        return false;
      }
      if (timeFilter !== "all") {
        const itemDate = new Date(cb.createdAt || cb.date).getTime();
        if (!isNaN(itemDate)) {
          if (timeFilter === "today" && itemDate < todayStart) return false;
          if (timeFilter === "week" && itemDate < sevenDaysAgo) return false;
          if (timeFilter === "month" && itemDate < thirtyDaysAgo) return false;
        }
      }
      return true;
    });
  }, [cabBookings, timeFilter, tripFilter, carFilter, statusFilter]);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">Cab Service Bookings</h1>
          <p className="text-xs text-slate-400 font-medium">
            Showing {filteredCabBookings.length} of {cabBookings.length} total vehicle reservations
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3.5">
        
        {/* Time Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Clock size={13} /> Time:
          </span>
          {[
            { id: "all", label: "All Time" },
            { id: "today", label: "Today" },
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                timeFilter === t.id
                  ? "bg-[#34A99D] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status, Trip Type & Vehicle Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <Filter size={13} /> Status:
            </span>
            {[
              { id: "all", label: "All Status" },
              { id: "Pending", label: "Pending" },
              { id: "Confirmed", label: "Confirmed" },
              { id: "Cancelled", label: "Cancelled" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                  statusFilter === s.id
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Trip Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              Trip:
            </span>
            {[
              { id: "all", label: "All Trips" },
              { id: "one-way", label: "One Way" },
              { id: "round", label: "Round Trip" },
              { id: "hourly", label: "Hourly" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTripFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                  tripFilter === t.id
                    ? "bg-[#34A99D] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Car Model Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <Car size={13} /> Vehicle:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "Hatchback", label: "Hatchback" },
              { id: "Sedan", label: "Sedan" },
              { id: "SUV (Ertiga / Innova)", label: "SUV" },
              { id: "Tempo Traveller", label: "Tempo" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCarFilter(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                  carFilter === c.id
                    ? "bg-[#0F172A] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-bold text-slate-400 animate-pulse">Loading cab bookings...</div>
      ) : (
        <>
          {filteredCabBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-xs sm:text-sm font-medium">No cab bookings match the selected filters.</p>
            </div>
          ) : (
            <>
              {/* 1. MOBILE CARDS VIEW */}
              <div className="grid grid-cols-1 gap-3.5 sm:hidden">
                {filteredCabBookings.map((cb) => (
                  <div key={cb._id} className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md inline-block mb-1">
                          {cb.carName}
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">{cb.userName}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${cb.status === "Confirmed" ? "bg-green-100 text-green-700" : cb.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {cb.status || "Pending"}
                      </span>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-[#34A99D]" />
                        <a href={`tel:${cb.phone}`} className="font-bold hover:underline">{cb.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={13} className="text-[#458393]" />
                        <span className="truncate">{cb.email}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60 font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                        <span className="text-[#34A99D] truncate">{cb.pickup}</span> 
                        <ArrowRight size={12} className="text-slate-400 shrink-0" /> 
                        <span className="text-[#458393] truncate">{cb.drop}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><CalendarIcon size={12} className="text-amber-500" /> {cb.date}</span>
                        <span className="font-black text-emerald-600 text-xs">₹ {cb.estimatedFare?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {cb.status !== "Confirmed" && (
                        <button onClick={() => handleStatusChange(cb._id, "Confirmed")} className="bg-green-600 text-white text-[11px] px-3 py-1.5 rounded-xl font-bold cursor-pointer">Confirm</button>
                      )}
                      {cb.status !== "Cancelled" && (
                        <button onClick={() => handleStatusChange(cb._id, "Cancelled")} className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-xl font-bold cursor-pointer">Cancel</button>
                      )}
                      <button onClick={() => handleDeleteBooking(cb._id, cb.userName)} className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-xl transition cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. DESKTOP TABLE VIEW */}
              <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-100">
                      <tr>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Route</th>
                        <th className="p-3.5">Car Booked</th>
                        <th className="p-3.5">Schedule</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredCabBookings.map((cb) => (
                        <tr key={cb._id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 font-black text-slate-900">{cb.userName}</td>
                          <td className="p-3.5 font-bold text-slate-800">
                            <div>{cb.phone}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{cb.email}</div>
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">
                            <span className="font-bold text-[#34A99D]">{cb.pickup}</span> &rarr; <span className="font-bold text-[#458393]">{cb.drop}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                              {cb.carName}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div className="font-bold">{cb.date}</div>
                            <div className="text-[10px] text-slate-400">{cb.time}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${cb.status === "Confirmed" ? "bg-green-100 text-green-700" : cb.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                              {cb.status || "Pending"}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {cb.status !== "Confirmed" && (
                                <button onClick={() => handleStatusChange(cb._id, "Confirmed")} className="bg-green-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer">Confirm</button>
                              )}
                              {cb.status !== "Cancelled" && (
                                <button onClick={() => handleStatusChange(cb._id, "Cancelled")} className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer">Cancel</button>
                              )}
                              <button onClick={() => handleDeleteBooking(cb._id, cb.userName)} className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-1.5 rounded-lg transition cursor-pointer" title="Delete Booking">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCabBookings;