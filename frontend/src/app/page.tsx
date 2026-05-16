"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight, ShieldCheck, MapPin, BadgeCheck, Zap, Star, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const stats = [
    { label: "Cars Sold", value: "10K+" },
    { label: "Happy Customers", value: "9.8K+" },
    { label: "Cities Covered", value: "50+" },
    { label: "Years Experience", value: "15+" },
  ];

  const brands = ["BMW", "Audi", "Mercedes", "Hyundai", "Maruti", "Tata", "Mahindra"];

  const features = [
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "Certified Cars", desc: "140-point rigorous inspection for all cars." },
    { icon: <BadgeCheck className="w-6 h-6 text-primary" />, title: "1 Year Warranty", desc: "Comprehensive warranty for peace of mind." },
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "Easy Finance", desc: "Quick loan approvals with zero downpayment." },
    { icon: <MapPin className="w-6 h-6 text-primary" />, title: "Doorstep Delivery", desc: "Get your dream car delivered to your home." },
  ];

  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        const res = await fetchAPI('/cars?limit=3'); // fetch recent 3 cars as featured
        setFeaturedCars(res.data || []);
      } catch (err) {
        console.error("Failed to fetch featured cars", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedCars();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Luxury Car Showcase"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
              Drive Your <br />
              <span className="text-primary">Dream Car</span> Today.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Experience the premium way to buy used cars. Fully inspected, certified, and delivered right to your doorstep.
            </p>

            {/* Search Box */}
            <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by brand, model, or budget..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/cars?search=${searchQuery}`)}
                  className="w-full bg-input/50 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <button 
                onClick={() => router.push(`/cars?search=${searchQuery}`)}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Find Cars
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center px-4"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Collection</h2>
              <p className="text-muted-foreground max-w-xl">Handpicked premium vehicles that offer the perfect blend of luxury, performance, and value.</p>
            </div>
            <Link href="/cars" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
              View All Cars <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">Loading featured cars...</div>
            ) : featuredCars.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">No featured cars found.</div>
            ) : (
              featuredCars.map((car, idx) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group glass-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-60 overflow-hidden bg-input">
                    {car.images && car.images[0] ? (
                      <Image src={car.images[0]} alt={car.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : null}
                    <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{car.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{car.year}</span> • <span>{car.mileage} kmpl</span> • <span>{car.fuelType}</span> • <span>{car.transmission}</span>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                      <span className="text-2xl font-bold text-foreground">₹ {car.price.toLocaleString('en-IN')}</span>
                      <Link href={`/cars/${car.slug}`} className="bg-white/10 hover:bg-white/20 text-foreground px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/cars" className="inline-flex items-center gap-2 text-primary font-medium">
              View All Cars <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The AutoVault Advantage</h2>
            <p className="text-muted-foreground">We are revolutionizing the used car market with transparency, quality, and customer-first approach.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-background border border-border p-8 rounded-2xl text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Section (Budget & Body Type) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Find Your Perfect Car</h2>
            <p className="text-muted-foreground">Browse our extensive inventory by budget, body type, or your favorite brand.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Browse by Budget */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">₹</span>
                Browse by Budget
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Under ₹ 5 Lakh", query: "maxPrice=500000" },
                  { label: "₹ 5 Lakh - ₹ 10 Lakh", query: "minPrice=500000&maxPrice=1000000" },
                  { label: "₹ 10 Lakh - ₹ 20 Lakh", query: "minPrice=1000000&maxPrice=2000000" },
                  { label: "Above ₹ 20 Lakh", query: "minPrice=2000000" }
                ].map((item, idx) => (
                  <Link 
                    key={idx}
                    href={`/cars?${item.query}`}
                    className="bg-card border border-border hover:border-primary px-6 py-4 rounded-xl text-foreground font-medium flex justify-between items-center group transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Browse by Body Type */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                  <Car className="w-4 h-4" />
                </span>
                Browse by Body Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["Hatchback", "Sedan", "SUV", "MUV", "Luxury"].map((type, idx) => (
                  <Link 
                    key={idx}
                    href={`/cars?bodyType=${type}`}
                    className="bg-card border border-border hover:border-primary p-4 rounded-xl text-center transition-colors group"
                  >
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">{type}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Brands */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                  <Star className="w-4 h-4" />
                </span>
                Popular Brands
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand, idx) => (
                  <Link
                    key={idx}
                    href={`/cars?brand=${brand}`}
                    className="px-5 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors bg-card font-medium text-foreground text-sm"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
