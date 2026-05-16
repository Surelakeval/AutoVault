"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Calendar, Settings, Fuel, Navigation, ShieldCheck, 
  MapPin, CheckCircle2, Heart, Share2, Info, MessageSquare, X, Send
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchAPI } from "@/lib/api";

export default function CarDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [car, setCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "seller", text: "Hi there! Let me know if you have any questions about the car." }
  ]);
  
  // EMI State
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenure, setTenure] = useState(60);

  // Test Drive State
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState("");
  const [testDriveTime, setTestDriveTime] = useState("");
  const [testDrivePhone, setTestDrivePhone] = useState("");
  const [isBookingStatus, setIsBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleBookTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingStatus('loading');
    try {
      await fetchAPI('/test-drives', {
        method: 'POST',
        body: JSON.stringify({
          carId: car._id,
          preferredDate: testDriveDate,
          preferredTime: testDriveTime,
          contactNumber: testDrivePhone
        })
      });
      setIsBookingStatus('success');
      setTimeout(() => {
        setIsTestDriveOpen(false);
        setIsBookingStatus('idle');
      }, 2000);
    } catch (error) {
      console.error("Test drive booking failed", error);
      setIsBookingStatus('idle');
      alert("Failed to book test drive. Please login first.");
    }
  };

  useEffect(() => {
    const loadCar = async () => {
      try {
        const res = await fetchAPI(`/cars/${slug}`);
        setCar(res.data);
      } catch (err) {
        console.error("Failed to fetch car", err);
        // Fallback or redirect if not found
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) loadCar();
  }, [slug]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: "user", text: message }]);
    setMessage("");
    // Simulate seller reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: "seller", text: "Thanks for your message! I'll get back to you shortly." }]);
    }, 1500);
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Car Details...</div>;
  if (!car) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Car not found.</div>;

  // Derive extra details
  const loanAmount = car.price - (car.price * (downPaymentPct / 100));
  const interestRate = 10.5; // 10.5% per annum
  const monthlyInterestRatio = (interestRate / 100) / 12;
  const emiValue = Math.round((loanAmount * monthlyInterestRatio * Math.pow(1 + monthlyInterestRatio, tenure)) / (Math.pow(1 + monthlyInterestRatio, tenure) - 1));

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/cars" className="hover:text-primary transition-colors">Used Cars</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate">{car.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Images & Details */}
          <div className="flex-1">
            {/* Image Gallery */}
            <div className="glass-card rounded-2xl overflow-hidden mb-8 p-2">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-2">
                <Image 
                  src={car.images[activeImage]} 
                  alt={car.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-primary text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-primary text-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {car.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill sizes="150px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Overview */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Car Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> Year</div>
                  <div className="font-semibold text-foreground">{car.year}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground"><Navigation className="w-4 h-4" /> Mileage</div>
                  <div className="font-semibold text-foreground">{car.mileage} kmpl</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground"><Fuel className="w-4 h-4" /> Fuel Type</div>
                  <div className="font-semibold text-foreground">{car.fuelType}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground"><Settings className="w-4 h-4" /> Transmission</div>
                  <div className="font-semibold text-foreground">{car.transmission}</div>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{car.description}</p>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">Top Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h1 className="text-3xl font-bold text-foreground mb-2">{car.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-6 pb-6 border-b border-border">
                <MapPin className="w-4 h-4" /> {car.location}
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Selling Price</div>
                <div className="text-4xl font-bold text-foreground mb-4">₹ {car.price.toLocaleString('en-IN')}</div>
                
                {/* Interactive EMI Calculator */}
                <div className="bg-input/30 p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-foreground">Estimated EMI</span>
                    <span className="text-lg font-black text-primary">₹ {emiValue.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Down Payment</span>
                        <span>{downPaymentPct}% (₹ {Math.round(car.price * (downPaymentPct/100)).toLocaleString('en-IN')})</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" max="80" step="5"
                        value={downPaymentPct}
                        onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Loan Tenure</span>
                        <span>{tenure} Months</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" max="84" step="12"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ownership</span>
                  <span className="font-semibold text-foreground">{car.ownership || '1st Owner'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-foreground">{car.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link 
                  href={`/buy/${car.slug}`}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg"
                >
                  Reserve for ₹10,000
                </Link>
                <button 
                  onClick={() => setIsTestDriveOpen(true)}
                  className="w-full bg-background border border-primary text-primary hover:bg-primary/10 font-bold py-4 rounded-xl transition-colors"
                >
                  Book Free Home Test Drive
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-background border border-border text-foreground hover:border-primary font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" /> Chat with Seller
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="bg-background border border-border rounded-xl p-3 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">AutoVault Assured</h4>
                    <p className="text-xs text-muted-foreground">140-Point Quality Inspected</p>
                  </div>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Fixed Price</h4>
                    <p className="text-xs text-muted-foreground">No hidden charges or negotiations</p>
                  </div>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">5-Day Money Back</h4>
                    <p className="text-xs text-muted-foreground">Return it if you don't love it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      <AnimatePresence>
        {isTestDriveOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsTestDriveOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">Book Test Drive</h2>
              <p className="text-sm text-muted-foreground mb-6">We'll bring the {car.title} to your doorstep.</p>

              <form onSubmit={handleBookTestDrive} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    required
                    value={testDriveDate}
                    onChange={(e) => setTestDriveDate(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Preferred Time</label>
                  <select 
                    required
                    value={testDriveTime}
                    onChange={(e) => setTestDriveTime(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Enter your mobile number"
                    value={testDrivePhone}
                    onChange={(e) => setTestDrivePhone(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isBookingStatus === 'loading'}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 mt-4 transition-colors"
                >
                  {isBookingStatus === 'loading' ? 'Booking...' : isBookingStatus === 'success' ? 'Booked Successfully!' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Floating Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-sm">Seller Chat</h4>
                  <p className="text-xs text-white/80">Typically replies in 1 hr</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-background p-4 overflow-y-auto flex flex-col gap-3">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white self-end rounded-br-none' : 'bg-card border border-border text-foreground self-start rounded-bl-none'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-border flex items-center gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-input border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <button type="submit" disabled={!message.trim()} className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
