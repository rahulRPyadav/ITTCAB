import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Trash2, Users, Calendar as CalendarIcon, Clock, Filter, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const AdminTourLeads = () => {
  const [bookings, setBookings] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("all"); 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings`);
      setBookings(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id, customerName) => {
    if (window.confirm(`Are you sure you want to delete lead for "${customerName}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        alert("Delete Error");
      }
    }
  };

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;

    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) {
        return false;
      }
      if (timeFilter !== "all") {
        const itemDate = new Date(b.createdAt || b.travelDate).getTime();
        if (isNaN(itemDate)) return true;
        if (timeFilter === "today" && itemDate < todayStart) return false;
        if (timeFilter === "week" && itemDate < sevenDaysAgo) return false;
        if (timeFilter === "month" && itemDate < thirtyDaysAgo) return false;
      }
      return true;
    });
  }, [bookings, timeFilter, statusFilter]);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">Tour Leads & Inquiries</h1>
          <p className="text-xs text-slate-400 font-medium">
            Showing {filteredBookings.length} of {bookings.length} total customer inquiries
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Time Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                timeFilter === t.id
                  ? "bg-[#34A99D] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status Filters */}
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                statusFilter === s.id
                  ? "bg-[#0F172A] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEADS LIST CONTENT */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs sm:text-sm font-medium">No tour leads match the selected filter criteria.</p>
        </div>
      ) : (
        <>
          {/* 1. MOBILE CARDS VIEW (Visible only on small screens) */}
          <div className="grid grid-cols-1 gap-3.5 sm:hidden">
            {filteredBookings.map((b) => (
              <div key={b._id} className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#458393] bg-[#FFF3C8] px-2 py-0.5 rounded-md inline-block mb-1">
                      {b.tourName}
                    </span>
                    <h3 className="font-black text-slate-900 text-sm">{b.customerName}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${b.status === "Confirmed" ? "bg-green-100 text-green-700" : b.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#34A99D]" />
                    <a href={`tel:${b.phone}`} className="font-bold hover:underline">{b.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={13} className="text-[#458393]" />
                    <span className="truncate">{b.email}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><CalendarIcon size={12} className="text-amber-500" /> {b.travelDate}</span>
                    <span className="flex items-center gap-1 font-bold text-slate-800"><Users size={12} className="text-[#34A99D]" /> {b.guests || 1} Guests</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {b.status !== "Confirmed" && (
                    <button onClick={() => handleStatusChange(b._id, "Confirmed")} className="bg-green-600 text-white text-[11px] px-3 py-1.5 rounded-xl font-bold cursor-pointer">Confirm</button>
                  )}
                  {b.status !== "Cancelled" && (
                    <button onClick={() => handleStatusChange(b._id, "Cancelled")} className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-xl font-bold cursor-pointer">Cancel</button>
                  )}
                  <button onClick={() => handleDeleteBooking(b._id, b.customerName)} className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-xl transition cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. DESKTOP TABLE VIEW (Hidden on small screens, visible on sm and up) */}
          <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">Tour Destination</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Travel Date</th>
                    <th className="p-3.5">Guests</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900 max-w-[200px] truncate">{b.tourName}</td>
                      <td className="p-3.5 font-semibold text-slate-700">{b.customerName}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{b.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{b.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{b.travelDate}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 bg-[#FFF3C8] text-[#458393] px-2 py-0.5 rounded text-[10px] font-black">
                          <Users size={10} /> {b.guests || 1}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${b.status === "Confirmed" ? "bg-green-100 text-green-700" : b.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {b.status !== "Confirmed" && (
                            <button onClick={() => handleStatusChange(b._id, "Confirmed")} className="bg-green-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer">Confirm</button>
                          )}
                          {b.status !== "Cancelled" && (
                            <button onClick={() => handleStatusChange(b._id, "Cancelled")} className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer">Cancel</button>
                          )}
                          <button onClick={() => handleDeleteBooking(b._id, b.customerName)} className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-1.5 rounded-lg transition cursor-pointer">
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
    </div>
  );
};

export default AdminTourLeads;