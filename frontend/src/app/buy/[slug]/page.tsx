"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, CheckCircle2, Clock, CreditCard, Landmark,
  ChevronRight, ChevronLeft, Phone, MapPin, X, Star,
  AlertCircle, Car
} from "lucide-react";
import { fetchAPI } from "@/lib/api";

const STEPS = ["Choose Payment", "Finance Details", "Contact Info", "Confirm & Pay"];

export default function BuyCar() {
  const { slug } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form state
  const [financeType, setFinanceType] = useState<"full_payment" | "loan">("full_payment");
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTenure, setLoanTenure] = useState(60);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAPI(`/cars/${slug}`);
        setCar(res.data);
      } catch {
        router.push("/cars");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) load();
  }, [slug, router]);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!car) return null;

  const loanAmount = car.price - (car.price * (downPaymentPct / 100));
  const interestRate = 10.5;
  const monthlyRate = (interestRate / 100) / 12;
  const emiValue = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) / (Math.pow(1 + monthlyRate, loanTenure) - 1));
  const downPaymentValue = Math.round(car.price * (downPaymentPct / 100));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetchAPI('/orders/reserve', {
        method: 'POST',
        body: JSON.stringify({
          carId: car._id,
          financeType,
          downPayment: financeType === 'loan' ? downPaymentValue : undefined,
          loanTenure: financeType === 'loan' ? loanTenure : undefined,
          emiAmount: financeType === 'loan' ? emiValue : undefined,
          contactPhone: phone,
          deliveryAddress: address,
        })
      });
      setOrderId(res.data.paymentRef);
      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message || "Booking failed. Please make sure you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-3xl p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Car Reserved!</h1>
          <p className="text-muted-foreground mb-6">
            Your reservation has been confirmed. Our team will contact you within 24 hours to complete the purchase.
          </p>
          <div className="bg-input/50 rounded-2xl p-5 mb-8 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
            <div className="text-2xl font-black text-primary tracking-widest">{orderId}</div>
          </div>
          <div className="space-y-3 text-left mb-8">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> ₹10,000 token amount reserved
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Car held for 72 hours exclusively for you
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> 100% refundable if you change your mind
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/profile')} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              View My Orders
            </button>
            <button onClick={() => router.push('/cars')} className="flex-1 bg-input border border-border text-foreground font-bold py-3 rounded-xl hover:bg-input/80 transition-colors">
              Browse More Cars
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-card border border-border hover:border-primary transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reserve this Car</h1>
            <p className="text-muted-foreground text-sm">Pay ₹10,000 token to hold this car</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Steps */}
          <div className="flex-1">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${idx <= currentStep ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'}`}>
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className={`hidden sm:block text-xs font-medium ml-2 ${idx === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                {/* Step 0: Choose Payment Type */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">How would you like to pay?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setFinanceType('full_payment')}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${financeType === 'full_payment' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <CreditCard className={`w-8 h-8 mb-4 ${financeType === 'full_payment' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="font-bold text-foreground mb-1">Full Payment</h3>
                        <p className="text-sm text-muted-foreground">Pay the full amount of ₹ {car.price.toLocaleString('en-IN')} and own the car outright.</p>
                        <div className="mt-4 text-xs font-semibold text-green-500">No interest charges</div>
                      </button>
                      <button
                        onClick={() => setFinanceType('loan')}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${financeType === 'loan' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <Landmark className={`w-8 h-8 mb-4 ${financeType === 'loan' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="font-bold text-foreground mb-1">Car Loan (EMI)</h3>
                        <p className="text-sm text-muted-foreground">Finance your car with easy monthly installments at 10.5% p.a.</p>
                        <div className="mt-4 text-xs font-semibold text-primary">Quick approval in 24 hours</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Finance Details */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      {financeType === 'full_payment' ? 'Payment Summary' : 'Configure Your Loan'}
                    </h2>
                    {financeType === 'full_payment' ? (
                      <div className="space-y-4">
                        <div className="bg-input/30 p-5 rounded-xl border border-border">
                          <div className="flex justify-between mb-3 text-sm"><span className="text-muted-foreground">Car Price</span><span className="font-semibold text-foreground">₹ {car.price.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between mb-3 text-sm"><span className="text-muted-foreground">Token Amount (to reserve)</span><span className="font-semibold text-foreground">₹ 10,000</span></div>
                          <div className="flex justify-between mb-3 text-sm"><span className="text-muted-foreground">Balance Due (at delivery)</span><span className="font-semibold text-foreground">₹ {(car.price - 10000).toLocaleString('en-IN')}</span></div>
                          <div className="border-t border-border pt-3 mt-3 flex justify-between"><span className="font-bold text-foreground">Total Price</span><span className="font-black text-primary text-lg">₹ {car.price.toLocaleString('en-IN')}</span></div>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-sm text-green-600">
                          ✅ Fixed Price Guarantee — No hidden charges or last-minute additions.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl text-center">
                          <div className="text-sm text-muted-foreground mb-1">Your Estimated Monthly EMI</div>
                          <div className="text-4xl font-black text-primary">₹ {emiValue.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-muted-foreground mt-1">at 10.5% p.a. for {loanTenure} months</div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground font-medium">Down Payment ({downPaymentPct}%)</span>
                            <span className="font-bold text-foreground">₹ {downPaymentValue.toLocaleString('en-IN')}</span>
                          </div>
                          <input type="range" min="10" max="80" step="5" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full h-2 accent-primary cursor-pointer" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>10%</span><span>80%</span></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground font-medium">Loan Tenure</span>
                            <span className="font-bold text-foreground">{loanTenure} Months</span>
                          </div>
                          <input type="range" min="12" max="84" step="12" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-2 accent-primary cursor-pointer" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>12 months</span><span>84 months</span></div>
                        </div>
                        <div className="bg-input/30 p-4 rounded-xl border border-border text-sm space-y-2">
                          <div className="flex justify-between"><span className="text-muted-foreground">Loan Amount</span><span className="font-semibold">₹ {loanAmount.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Interest Rate</span><span className="font-semibold">10.5% p.a.</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Total Payable</span><span className="font-semibold">₹ {(emiValue * loanTenure + downPaymentValue).toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">Your Contact Details</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Delivery Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                          <textarea
                            required
                            placeholder="Enter your full address for home delivery"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-foreground focus:outline-none focus:border-primary resize-none"
                          />
                        </div>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">Our team will call you on this number within 24 hours to schedule the test drive and confirm paperwork.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirm & Pay */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">Confirm Your Reservation</h2>
                    <div className="space-y-4">
                      <div className="bg-input/30 p-5 rounded-xl border border-border space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Car</span><span className="font-semibold text-foreground">{car.title}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Payment Type</span><span className="font-semibold text-foreground capitalize">{financeType === 'loan' ? 'Car Loan (EMI)' : 'Full Payment'}</span></div>
                        {financeType === 'loan' && <div className="flex justify-between"><span className="text-muted-foreground">Monthly EMI</span><span className="font-bold text-primary">₹ {emiValue.toLocaleString('en-IN')}</span></div>}
                        <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-semibold text-foreground">{phone}</span></div>
                        <div className="flex justify-between items-start"><span className="text-muted-foreground">Address</span><span className="font-semibold text-foreground text-right max-w-[60%]">{address}</span></div>
                        <div className="border-t border-border pt-3 flex justify-between"><span className="font-bold text-foreground">Token Amount (Today)</span><span className="font-black text-primary text-xl">₹ 10,000</span></div>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">This car will be reserved exclusively for you for <strong className="text-foreground">72 hours</strong>. The token of ₹10,000 is 100% refundable.</p>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !phone || !address}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-colors text-lg disabled:opacity-50 shadow-lg shadow-primary/20"
                      >
                        {isSubmitting ? "Processing..." : "Pay ₹10,000 & Reserve Now"}
                      </button>
                      <p className="text-center text-xs text-muted-foreground">This is a demo. No actual payment will be made.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <button onClick={() => setCurrentStep(s => s - 1)} className="flex-1 bg-card border border-border text-foreground font-bold py-3 rounded-xl hover:bg-input transition-colors flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {currentStep < STEPS.length - 1 && (
                <button
                  onClick={() => {
                    if (currentStep === 2 && (!phone || !address)) { alert("Please fill in your phone and address."); return; }
                    setCurrentStep(s => s + 1);
                  }}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Car Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24">
              <div className="relative h-48">
                {car.images?.[0] ? (
                  <Image src={car.images[0]} alt={car.title} fill sizes="(max-width: 1024px) 100vw, 320px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-input flex items-center justify-center">
                    <Car className="w-16 h-16 text-muted-foreground opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground mb-1 line-clamp-2">{car.title}</h3>
                <div className="text-2xl font-black text-primary mb-4">₹ {car.price.toLocaleString('en-IN')}</div>
                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground font-medium">AutoVault Assured</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-foreground font-medium">5-Day Money Back</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-foreground font-medium">1-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-foreground font-medium">Reserved for 72 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
