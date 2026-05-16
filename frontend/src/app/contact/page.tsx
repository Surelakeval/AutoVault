"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: '', email: '', phone: '', message: '' });
    
    // In actual implementation, send this to backend /api/contact
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">Have a question or want to sell your car? Reach out to our team.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl"><MapPin className="text-primary w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Our Location</h3>
                <p className="text-muted-foreground mt-1">123 Auto Hub Drive, Motor City, Ahmedabad, Gujarat 380015</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl"><Phone className="text-primary w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Call Us</h3>
                <p className="text-muted-foreground mt-1">+91 98765 43210</p>
                <p className="text-sm text-muted-foreground mt-1">Mon-Sat, 9am to 8pm</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl"><Mail className="text-primary w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Email Us</h3>
                <p className="text-muted-foreground mt-1">hello@autovault.com</p>
                <p className="text-sm text-muted-foreground mt-1">We typically reply in 24 hrs</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            
            {status && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-xl mb-6">
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  placeholder="+91 90000 00000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea 
                  required 
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-colors w-full md:w-auto"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
