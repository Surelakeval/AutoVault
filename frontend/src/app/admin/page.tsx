"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Car, Users, MessageSquare, IndianRupee, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    activeListings: 0,
  });

  useEffect(() => {
    // We fetch real counts from API or mock them for now if API lacks specific aggregations
    const fetchStats = async () => {
      try {
        const carsRes = await fetchAPI('/cars?limit=1');
        setStats(prev => ({ ...prev, totalCars: carsRes.count }));
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Cars Listed", value: stats.totalCars || "24", icon: <Car className="w-6 h-6 text-blue-500" />, trend: "+12%" },
    { title: "Active Users", value: "156", icon: <Users className="w-6 h-6 text-green-500" />, trend: "+5%" },
    { title: "Total Revenue", value: "₹ 4.2 Cr", icon: <IndianRupee className="w-6 h-6 text-purple-500" />, trend: "+24%" },
    { title: "New Messages", value: "42", icon: <MessageSquare className="w-6 h-6 text-orange-500" />, trend: "Requires action" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-card border border-border p-6 rounded-2xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-background rounded-xl border border-border">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-input text-muted-foreground'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Car Listings</h3>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm">
                  <th className="pb-3 font-medium">Car Name</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 font-medium text-foreground">BMW 3 Series 330i</td>
                  <td className="py-4 text-muted-foreground">₹ 45.5 Lakh</td>
                  <td className="py-4"><span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold">Active</span></td>
                  <td className="py-4 text-muted-foreground text-sm">Today</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 font-medium text-foreground">Hyundai Creta SX</td>
                  <td className="py-4 text-muted-foreground">₹ 16.5 Lakh</td>
                  <td className="py-4"><span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold">Pending</span></td>
                  <td className="py-4 text-muted-foreground text-sm">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button className="bg-primary hover:bg-primary/90 text-white font-medium p-4 rounded-xl text-left flex items-center justify-between transition-colors">
              <span>Add New Car</span>
              <TrendingUp className="w-5 h-5" />
            </button>
            <button className="bg-input hover:bg-input/80 border border-border text-foreground font-medium p-4 rounded-xl text-left transition-colors">
              Review Pending Ads
            </button>
            <button className="bg-input hover:bg-input/80 border border-border text-foreground font-medium p-4 rounded-xl text-left transition-colors">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
