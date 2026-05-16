"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Plus, Edit, Trash2, Search, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetchAPI('/cars');
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await fetchAPI(`/cars/${id}`, { method: 'DELETE' });
        fetchCars(); // Refresh list
      } catch (error) {
        alert("Failed to delete car");
      }
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Cars</h1>
          <p className="text-muted-foreground">View, edit, and delete car listings.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap w-full md:w-auto">
          <Plus className="w-5 h-5" /> Add New Car
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by brand, model, or slug..." 
              className="w-full bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select className="bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-input/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium">Car Details</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Seller</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading cars...</td></tr>
              ) : cars.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No cars found in the database.</td></tr>
              ) : (
                cars.map((car) => (
                  <tr key={car._id} className="hover:bg-input/20 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                        {car.images && car.images[0] ? (
                          <Image src={car.images[0]} alt={car.title} fill sizes="64px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-input flex items-center justify-center"><Car className="w-5 h-5 text-muted-foreground" /></div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{car.title}</div>
                        <div className="text-xs text-muted-foreground">{car.year} • {car.kms} • {car.fuelType}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{car.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        car.status === 'active' ? 'bg-green-500/10 text-green-500' :
                        car.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {(car.status || 'active').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {car.seller?.name || 'Admin'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-input rounded-lg text-muted-foreground hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(car._id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-input rounded-lg text-muted-foreground transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing 1 to {cars.length} of {cars.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded-lg hover:bg-input transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-border rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">1</button>
            <button className="px-3 py-1 border border-border rounded-lg hover:bg-input transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
