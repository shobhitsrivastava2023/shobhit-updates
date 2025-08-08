'use client';

import React, { useState, useEffect } from 'react';
import { dailyEntriesAPI, NewDailyEntry } from '@/api/dailyEntries'; // Adjust the import path as needed
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/supabase'; // Import the supabase client
import type { Session } from '@supabase/supabase-js';

// --- Admin Login Component ---
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // The onAuthStateChange listener will handle the successful login state change.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#111111] rounded-lg border border-[#1a1a1a] shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#e5e5e5]">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded text-sm font-medium text-white transition-colors duration-150 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Admin Dashboard Component (Create Entry Form) ---
const AdminDashboard = () => {
  const [formData, setFormData] = useState<NewDailyEntry>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    blog_url: '',
    attachments: [],
    references: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const result = await dailyEntriesAPI.createEntry(formData);

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          blog_url: '',
          attachments: [],
          references: [],
        });
        setSubmitStatus('idle');
      }, 2000);
    } else {
      setSubmitStatus('error');
      // Use optional chaining in case error is not a standard Error object
      const message = (result.error as any)?.message || 'An unknown error occurred.';
      setErrorMessage(message);
      console.error("Failed to create entry:", message);
    }
    setIsSubmitting(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle setting the session to null
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#e5e5e5]">Admin Dashboard</h1>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1f1f1f] rounded">
                Logout
            </button>
        </div>
        <div className="bg-[#111111] rounded-lg border border-[#1a1a1a] p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Daily Entry</h2>
          <form onSubmit={handleCreateEntry} className="space-y-4">
            {/* Form inputs remain the same... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none" placeholder="What did you work on?" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none resize-vertical" placeholder="Detailed description of your work..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Blog URL (Optional)</label>
              <input type="url" name="blog_url" value={formData.blog_url || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none" placeholder="https://your-blog.com/post" />
            </div>
            <div className="flex items-center justify-end gap-4 pt-2">
              {submitStatus === 'success' && <div className="flex items-center gap-2 text-green-500"><CheckCircle size={18} /><span>Entry created!</span></div>}
              {submitStatus === 'error' && <div className="flex items-center gap-2 text-red-500"><AlertTriangle size={18} /><span>Error: {errorMessage}</span></div>}
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded text-sm font-medium text-white transition-colors duration-150 disabled:bg-[#1a1a1a] disabled:text-[#666] disabled:cursor-not-allowed">
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                {isSubmitting ? 'Creating...' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
            <Loader2 className="animate-spin text-white" size={32} />
        </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default AdminPage;