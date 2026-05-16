"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, Search, X } from "lucide-react";

export default function CompareCars() {
  const [showSearch, setShowSearch] = useState(false);

  // Mock data for comparison
  const compareList = [
    {
      id: 1, title: "BMW 3 Series 330i", price: "₹ 45.5 Lakh", year: 2021, kms: "24,000 km", fuel: "Petrol", 
      engine: "1998 cc", bhp: "254.79 bhp", transmission: "Automatic", mileage: "16.13 kmpl", image: "/images/car_bmw.png",
      features: { sunroof: true, camera360: true, cruise: true, ventilatedSeats: false }
    },
    {
      id: 2, title: "Mercedes-Benz C-Class", price: "₹ 42.0 Lakh", year: 2020, kms: "31,500 km", fuel: "Diesel", 
      engine: "1950 cc", bhp: "241.3 bhp", transmission: "Automatic", mileage: "17.6 kmpl", image: "/images/car_mercedes.png",
      features: { sunroof: true, camera360: false, cruise: true, ventilatedSeats: true }
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Compare Cars</h1>
          <p className="text-muted-foreground">Compare specifications, features, and prices side-by-side.</p>
        </div>

        <div className="overflow-x-auto pb-8">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-1/4 p-4 text-left border-b border-border bg-card/50"></th>
                {compareList.map(car => (
                  <th key={car.id} className="w-1/4 p-4 border-b border-border border-l align-top relative bg-card/50">
                    <button className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                      <Image src={car.image} alt={car.title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{car.title}</h3>
                    <div className="text-xl font-bold text-primary">{car.price}</div>
                  </th>
                ))}
                {compareList.length < 3 && (
                  <th className="w-1/4 p-4 border-b border-border border-l align-middle text-center bg-card/50">
                    <button className="flex flex-col items-center justify-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                        <Plus className="w-8 h-8" />
                      </div>
                      <span className="font-medium">Add Car</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Basic Details */}
              <tr className="bg-card/20"><td colSpan={4} className="p-4 font-bold text-foreground uppercase tracking-wider text-sm">Basic Details</td></tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Year</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.year}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Kilometers</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.kms}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Fuel Type</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.fuel}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Transmission</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.transmission}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>

              {/* Engine & Performance */}
              <tr className="bg-card/20"><td colSpan={4} className="p-4 font-bold text-foreground uppercase tracking-wider text-sm mt-4">Engine & Performance</td></tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Engine Displacement</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.engine}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Max Power</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.bhp}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Mileage (ARAI)</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-foreground font-medium text-center">{car.mileage}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>

              {/* Features */}
              <tr className="bg-card/20"><td colSpan={4} className="p-4 font-bold text-foreground uppercase tracking-wider text-sm mt-4">Key Features</td></tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Sunroof</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-center flex justify-center">{car.features.sunroof ? <Check className="text-green-500 w-5 h-5" /> : <Minus className="text-muted-foreground w-5 h-5" />}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">360 Camera</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-center flex justify-center">{car.features.camera360 ? <Check className="text-green-500 w-5 h-5" /> : <Minus className="text-muted-foreground w-5 h-5" />}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Cruise Control</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-center flex justify-center">{car.features.cruise ? <Check className="text-green-500 w-5 h-5" /> : <Minus className="text-muted-foreground w-5 h-5" />}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground font-medium">Ventilated Seats</td>
                {compareList.map(car => <td key={car.id} className="p-4 border-b border-l border-border text-center flex justify-center">{car.features.ventilatedSeats ? <Check className="text-green-500 w-5 h-5" /> : <Minus className="text-muted-foreground w-5 h-5" />}</td>)}
                {compareList.length < 3 && <td className="border-b border-l border-border"></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
