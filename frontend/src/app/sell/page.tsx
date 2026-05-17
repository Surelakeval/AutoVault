"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Calculator, CheckCircle2, ChevronRight, UploadCloud } from "lucide-react";
import Image from "next/image";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SellCar() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", brand: "", model: "", year: "", kms: "", fuelType: "Petrol", transmission: "Manual", mileage: "", ownership: "1st Owner", bodyType: "SUV", location: "", price: "", description: "", condition: "Good"
  });
  const [valuation, setValuation] = useState<{min: string, max: string} | null>(null);

  const getValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchAPI('/valuation', {
        method: 'POST',
        body: JSON.stringify({
          brand: formData.brand,
          year: parseInt(formData.year),
          kms: parseInt(formData.kms)
        })
      });
      setValuation({ min: res.data.minPrice, max: res.data.maxPrice });
      setStep(2);
    } catch (error) {
      console.error(error);
      setValuation({ min: "₹ 12.5 Lakh", max: "₹ 14.2 Lakh" });
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAd = async () => {
    setIsSubmitting(true);
    try {
      const carData = {
        title: `${formData.brand} ${formData.model}`,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseInt(formData.price.replace(/,/g, '')),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        mileage: parseInt(formData.mileage) || 15,
        ownership: formData.ownership,
        location: formData.location,
        bodyType: formData.bodyType,
        description: formData.description,
        images: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800"], // Placeholder
        features: ["Sunroof", "ABS", "Airbags"]
      };

      await fetchAPI('/cars', {
        method: 'POST',
        body: JSON.stringify(carData)
      });
      alert("Car posted successfully! It will be live after admin approval.");
      router.push('/cars');
    } catch (error: any) {
      alert("Failed to post car: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sell Your Car in <span className="text-primary">3 Easy Steps</span></h1>
          <p className="text-xl text-muted-foreground">Get a free, instant valuation and list your car to thousands of verified buyers directly on AutoVault.</p>
        </div>

        {/* Steps UI */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}>1</div>
            <div className={`h-1 w-16 md:w-32 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}>2</div>
            <div className={`h-1 w-16 md:w-32 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-border'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border'}`}>3</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <Calculator className="w-8 h-8 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Instant Valuation</h2>
                    <p className="text-muted-foreground text-sm">Tell us about your car to get an estimated price.</p>
                  </div>
                </div>

                <form onSubmit={getValuation} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Brand</label>
                      <select 
                        required className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      >
                        <option value="">Select Brand</option>
                        <option value="BMW">BMW</option>
                        <option value="Audi">Audi</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Honda">Honda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Model</label>
                      <input 
                        type="text" required placeholder="e.g. 3 Series 330i"
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Registration Year</label>
                      <select 
                        required className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})}
                      >
                        <option value="">Select Year</option>
                        {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Kilometers Driven</label>
                      <input 
                        type="number" required placeholder="e.g. 25000"
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        value={formData.kms} onChange={(e) => setFormData({...formData, kms: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Car Condition</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Excellent', 'Good', 'Fair'].map(cond => (
                        <div 
                          key={cond}
                          onClick={() => setFormData({...formData, condition: cond})}
                          className={`cursor-pointer border rounded-xl py-3 text-center text-sm font-medium transition-colors ${formData.condition === cond ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-input hover:border-primary/50 text-foreground'}`}
                        >
                          {cond}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl mt-6 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    {isSubmitting ? "Calculating..." : <>Get Instant Valuation <ChevronRight className="w-5 h-5" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && valuation && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Estimated Value</h2>
                  <p className="text-muted-foreground">Based on your car details and current market trends.</p>
                  
                  <div className="mt-6 bg-background border border-primary/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <h3 className="text-5xl font-bold text-foreground mb-2">{valuation.min} - {valuation.max}</h3>
                    <p className="text-primary font-medium">Excellent Resale Value 🚀</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button onClick={() => setStep(3)} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20">
                    Proceed to List Car
                  </button>
                  <button onClick={() => setStep(1)} className="w-full bg-transparent border border-border hover:border-primary text-foreground font-medium py-4 rounded-xl transition-colors">
                    Recalculate
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground">Post Your Ad</h2>
                  <p className="text-muted-foreground text-sm">Upload photos and add a description to go live.</p>
                </div>

                <div className="space-y-6">
                  {/* Upload Photos */}
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-input/50">
                    <UploadCloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-foreground font-medium mb-1">Click to upload car photos</h3>
                    <p className="text-xs text-muted-foreground">Upload up to 10 high-quality images (PNG, JPG)</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Selling Price (₹)</label>
                      <input 
                        type="text" required placeholder="e.g. 13,50,000" 
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary" 
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                      <input 
                        type="text" required placeholder="e.g. Ahmedabad" 
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary" 
                        value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                    <textarea 
                      rows={4} required placeholder="Describe your car's features, service history, and reason for selling..." 
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary resize-none"
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    onClick={handlePostAd}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl mt-6 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Posting..." : <><CheckCircle2 className="w-5 h-5" /> Post Ad Live</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
