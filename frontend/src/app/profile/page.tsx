"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { User, Mail, Calendar, Car, LogOut, Settings, ShoppingBag, Clock, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myCars, setMyCars] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('orders');
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await fetchAPI('/auth/me');
        setUser(userData.data);
        const carsData = await fetchAPI('/cars');
        const filtered = carsData.data.filter((car: any) => car.seller?._id === userData.data._id);
        setMyCars(filtered);
        try {
          const ordersData = await fetchAPI('/orders/my');
          setMyOrders(ordersData.data || []);
        } catch { setMyOrders([]); }
      } catch {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Cancel this reservation? Your ₹10,000 token will be refunded.")) return;
    try {
      await fetchAPI(`/orders/${orderId}/cancel`, { method: 'PUT' });
      setMyOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err: any) { alert(err.message || "Failed to cancel."); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/"); };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Profile...</div>;
  if (!user) return null;

  const statusColor: Record<string, string> = {
    reserved: 'bg-amber-500 text-black',
    confirmed: 'bg-blue-500 text-white',
    completed: 'bg-green-500 text-white',
    cancelled: 'bg-red-500 text-white',
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="glass-card rounded-3xl p-8 sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/30 mb-4">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold mt-1">{user.role}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-input/50 rounded-2xl border border-border">
                  <Mail className="w-5 h-5 text-primary" />
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm text-foreground font-semibold">{user.email}</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-input/50 rounded-2xl border border-border">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div><p className="text-xs text-muted-foreground">Joined</p><p className="text-sm text-foreground font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p></div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold py-3 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-card border border-border p-1 rounded-2xl w-fit">
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                <ShoppingBag className="w-4 h-4" /> My Orders {myOrders.length > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20' : 'bg-input'}`}>{myOrders.length}</span>}
              </button>
              <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-sm transition-colors ${activeTab === 'listings' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                <Car className="w-4 h-4" /> My Listings {myCars.length > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'listings' ? 'bg-white/20' : 'bg-input'}`}>{myCars.length}</span>}
              </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {myOrders.length === 0 ? (
                  <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center">
                    <ShoppingBag className="w-20 h-20 text-muted-foreground opacity-20 mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No orders yet.</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Find your dream car and reserve it for just ₹10,000.</p>
                    <Link href="/cars" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Cars</Link>
                  </div>
                ) : myOrders.map((order, idx) => (
                  <motion.div key={order._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-44 h-36 bg-input shrink-0">
                        {order.car?.images?.[0] ? <Image src={order.car.images[0]} alt={order.car.title} fill sizes="(max-width: 768px) 100vw, 200px" className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Car className="w-10 h-10 text-muted-foreground opacity-30" /></div>}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h4 className="font-bold text-foreground">{order.car?.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Ref: <span className="font-mono text-primary">{order.paymentRef}</span></p>
                          </div>
                          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${statusColor[order.status] || 'bg-border text-foreground'}`}>{order.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                          <div><span className="text-muted-foreground">Price</span> <span className="font-bold text-foreground ml-1">₹ {order.totalPrice?.toLocaleString('en-IN')}</span></div>
                          <div><span className="text-muted-foreground">Token</span> <span className="font-bold text-green-500 ml-1">₹ 10,000 ✓</span></div>
                          {order.financeType === 'loan' && <div><span className="text-muted-foreground">EMI</span> <span className="font-bold text-primary ml-1">₹ {order.emiAmount?.toLocaleString('en-IN')}/mo</span></div>}
                        </div>
                        <div className="flex gap-4 items-center">
                          <Link href={`/cars/${order.car?.slug}`} className="text-sm font-semibold text-primary hover:underline">View Car</Link>
                          {order.status === 'reserved' && (
                            <>
                              <button onClick={() => handleCancelOrder(order._id)} className="text-sm font-semibold text-destructive hover:underline flex items-center gap-1"><X className="w-3 h-3" /> Cancel & Refund</button>
                              <div className="ml-auto flex items-center gap-1 text-xs text-amber-500"><Clock className="w-3 h-3" /> Reserved 72h</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                {myCars.length === 0 ? (
                  <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center">
                    <Car className="w-20 h-20 text-muted-foreground opacity-20 mb-6" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No listings yet.</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Ready to sell? Post your first ad in minutes.</p>
                    <Link href="/sell" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">Sell Your Car</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myCars.map((car, idx) => (
                      <motion.div key={car._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card rounded-2xl overflow-hidden group border border-border hover:border-primary/50 transition-all">
                        <div className="relative h-48 bg-input">
                          {car.images?.[0] && <Image src={car.images[0]} alt={car.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${car.status === 'active' ? 'bg-green-500 text-white' : car.status === 'sold' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>{car.status}</div>
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg font-bold text-foreground mb-2 truncate">{car.title}</h4>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xl font-black text-primary">₹ {car.price.toLocaleString('en-IN')}</span>
                            <Link href={`/cars/${car.slug}`} className="p-2 bg-input rounded-lg hover:bg-primary hover:text-white transition-colors"><Settings className="w-4 h-4" /></Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
