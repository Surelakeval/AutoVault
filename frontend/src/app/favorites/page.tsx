"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Car, Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetchAPI("/favorites");
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFavorite = async (favoriteId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetchAPI(`/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      // Remove from local state
      setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
      alert("Failed to remove from wishlist. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary fill-primary" /> My Wishlist
          </h1>
          <p className="text-muted-foreground">
            Manage your saved vehicles ({favorites.length} premium cars)
          </p>
        </div>

        {/* Wishlist Grid */}
        {favorites.length === 0 ? (
          <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center max-w-2xl mx-auto border border-border">
            <Heart className="w-20 h-20 text-muted-foreground opacity-20 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-2">Your wishlist is empty.</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Explore our premium collection of handpicked certified cars and save your favorites here.
            </p>
            <Link
              href="/cars"
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
              Browse Premium Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav, idx) => {
              const car = fav.car;
              if (!car) return null;

              return (
                <motion.div
                  key={fav._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group glass-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col bg-card"
                >
                  {/* Car Image Container */}
                  <div className="relative h-52 bg-input shrink-0 overflow-hidden">
                    {car.images?.[0] ? (
                      <Image
                        src={car.images[0]}
                        alt={car.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-muted-foreground opacity-30" />
                      </div>
                    )}
                    {/* Delete / Remove Wishlist Button */}
                    <button
                      onClick={(e) => handleRemoveFavorite(fav._id, e)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all duration-200"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Car Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                      {car.brand}
                    </span>
                    <Link href={`/cars/${car.slug}`}>
                      <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {car.title}
                      </h4>
                    </Link>

                    {/* Meta Specifications */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-6">
                      <span className="bg-background px-2.5 py-1 rounded-md border border-border font-medium">
                        {car.year}
                      </span>
                      <span className="bg-background px-2.5 py-1 rounded-md border border-border font-medium">
                        {car.mileage?.toLocaleString()} km
                      </span>
                      <span className="bg-background px-2.5 py-1 rounded-md border border-border font-medium">
                        {car.fuelType}
                      </span>
                      <span className="bg-background px-2.5 py-1 rounded-md border border-border font-medium">
                        {car.transmission}
                      </span>
                    </div>

                    {/* Price and Details link */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                      <span className="text-xl font-extrabold text-foreground">
                        ₹ {car.price?.toLocaleString("en-IN")}
                      </span>
                      <Link
                        href={`/cars/${car.slug}`}
                        className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
