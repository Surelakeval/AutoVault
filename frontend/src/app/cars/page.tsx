"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Filter, Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

import { useSearchParams } from "next/navigation";

function BrowseCarsContent() {
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams?.get("brand") ? [searchParams.get("brand")!] : []
  );
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState<string | null>(searchParams?.get("bodyType"));
  const [minPrice, setMinPrice] = useState<string | null>(searchParams?.get("minPrice"));
  const [maxPrice, setMaxPrice] = useState<string | null>(searchParams?.get("maxPrice"));
  
  const loadCars = async () => {
    setIsLoading(true);
    try {
      // Construct query string based on filters
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));
      if (selectedFuels.length > 0) params.append('fuelType', selectedFuels.join(','));
      if (bodyType) params.append('bodyType', bodyType);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const res = await fetchAPI(`/cars?${params.toString()}`);
      setCars(res.data || []);
    } catch (err) {
      console.error("Failed to fetch cars", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleApplyFilters = () => {
    loadCars();
    if (window.innerWidth < 1024) setIsFilterOpen(false);
  };

  const toggleFilter = (stateSetter: any, currentState: string[], value: string) => {
    if (currentState.includes(value)) {
      stateSetter(currentState.filter(item => item !== value));
    } else {
      stateSetter([...currentState, value]);
    }
  };



  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Used Cars</h1>
          <p className="text-muted-foreground">Showing {cars.length} premium verified cars</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by model or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full bg-card border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            className="md:hidden p-2 bg-card border border-border rounded-lg text-foreground"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 shrink-0 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
            </div>

            {/* Filter Group: Brand */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex justify-between items-center cursor-pointer">
                Brand <ChevronDown className="w-4 h-4" />
              </h3>
              <div className="space-y-2">
                {["BMW", "Audi", "Mercedes-Benz", "Hyundai", "Maruti", "Honda"].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleFilter(setSelectedBrands, selectedBrands, brand)}
                      className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary accent-primary" 
                    />
                    <span className="text-muted-foreground text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Fuel Type */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex justify-between items-center cursor-pointer">
                Fuel Type <ChevronDown className="w-4 h-4" />
              </h3>
              <div className="space-y-2">
                {["Petrol", "Diesel", "Electric", "CNG"].map((fuel) => (
                  <label key={fuel} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedFuels.includes(fuel)}
                      onChange={() => toggleFilter(setSelectedFuels, selectedFuels, fuel)}
                      className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary accent-primary" 
                    />
                    <span className="text-muted-foreground text-sm">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleApplyFilters} className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white font-medium py-3 rounded-xl transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content (Grid) */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6 bg-card border border-border p-3 rounded-xl">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Sort by:</span>
              <select className="bg-transparent text-foreground font-medium outline-none cursor-pointer">
                <option>Newest Added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Mileage: Low to High</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground hidden sm:block">
              Showing 1-12 of 124 cars
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading Skeleton
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-input"></div>
                  <div className="p-5">
                    <div className="h-6 bg-input rounded-md w-3/4 mb-4"></div>
                    <div className="flex gap-2 mb-6">
                      <div className="h-6 bg-input rounded-md w-16"></div>
                      <div className="h-6 bg-input rounded-md w-16"></div>
                      <div className="h-6 bg-input rounded-md w-16"></div>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                      <div className="h-8 bg-input rounded-md w-24"></div>
                      <div className="h-4 bg-input rounded-md w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : cars.length === 0 ? (
              <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
                <Car className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-xl font-medium">No cars found matching your criteria</p>
              </div>
            ) : (
              cars.map((car, idx) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="group glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-input">
                    {car.images && car.images[0] ? (
                      <Image src={car.images[0]} alt={car.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Car className="w-10 h-10" /></div>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-primary text-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/cars/${car.slug}`}>
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">{car.title}</h3>
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                      <span className="bg-background px-2 py-1 rounded-md border border-border">{car.year}</span>
                      <span className="bg-background px-2 py-1 rounded-md border border-border">{car.mileage} kmpl</span>
                      <span className="bg-background px-2 py-1 rounded-md border border-border">{car.fuelType}</span>
                      <span className="bg-background px-2 py-1 rounded-md border border-border">{car.transmission}</span>
                    </div>
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-border">
                      <span className="text-xl font-bold text-foreground">₹ {car.price.toLocaleString('en-IN')}</span>
                      <Link href={`/cars/${car.slug}`} className="text-primary text-sm font-semibold hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors hover:border-primary disabled:opacity-50">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-primary text-white font-medium flex items-center justify-center">1</button>
            <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors hover:border-primary">2</button>
            <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors hover:border-primary">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-muted-foreground">...</span>
            <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors hover:border-primary disabled:opacity-50">
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BrowseCars() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center text-muted-foreground animate-pulse">Loading browse page...</div>}>
      <BrowseCarsContent />
    </Suspense>
  );
}

// Add Heart icon temporarily to this file since it's used
import { Heart, Car } from "lucide-react";
