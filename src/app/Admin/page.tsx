"use client";

import React, { useState, useEffect } from "react";
import { dailyEntriesAPI, NewDailyEntry } from "@/api/dailyEntries";
import { Loader2, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";
import { supabase } from "@/supabase";
import type { Session } from "@supabase/supabase-js";

// --- Admin Login Component ---
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        <h1 className="text-2xl font-bold text-center text-[#e5e5e5]">
          Admin Login
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded text-sm font-medium text-white transition-colors duration-150 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Dynamic Array Input Component ---
const DynamicArrayInput = ({ 
  label, 
  items, 
  onChange, 
  placeholder 
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) => {
  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-[#a0a0a0]">
          {label}
        </label>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e5e5e5] rounded transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-[#666666] italic py-2">
            No {label.toLowerCase()} added yet
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-[#2a1a1a] rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const [formData, setFormData] = useState<NewDailyEntry>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
    content: "", // New field for markdown content
    attachments: [],
    references: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentsChange = (attachments: string[]) => {
    setFormData((prev) => ({ ...prev, attachments }));
  };

  const handleReferencesChange = (references: string[]) => {
    setFormData((prev) => ({ ...prev, references }));
  };

  const handleCreateEntry = async () => {
    if (!formData.title || !formData.date || !formData.content) {
      setSubmitStatus("error");
      setErrorMessage("Title, date, and content are required");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const cleanedFormData = {
      ...formData,
      attachments: formData.attachments.filter(item => item.trim() !== ""),
      references: formData.references.filter(item => item.trim() !== "")
    };

    const result = await dailyEntriesAPI.createEntry(cleanedFormData);

    if (result.success) {
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          title: "",
          description: "",
          content: "",
          attachments: [],
          references: [],
        });
        setSubmitStatus("idle");
      }, 2000);
    } else {
      setSubmitStatus("error");
      const message =
        (result.error as any)?.message || "An unknown error occurred.";
      setErrorMessage(message);
      console.error("Failed to create entry:", message);
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e5e5e5]">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1f1f1f] rounded transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-[#111111] rounded-lg border border-[#1a1a1a] p-6">
          <h2 className="text-xl font-semibold mb-6">Create New Daily Entry</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none"
                  placeholder="What did you work on?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none resize-vertical"
                placeholder="Short summary for the entry list..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Content (Markdown)
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#e5e5e5] focus:border-blue-500 focus:outline-none resize-vertical"
                placeholder="Write your blog post here. Markdown is supported."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DynamicArrayInput
                label="Attachments"
                items={formData.attachments}
                onChange={handleAttachmentsChange}
                placeholder="File name or path"
              />

              <DynamicArrayInput
                label="References"
                items={formData.references}
                onChange={handleReferencesChange}
                placeholder="Reference URL or citation"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1a1a1a]">
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={18} />
                  <span>Entry created successfully!</span>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertTriangle size={18} />
                  <span>Error: {errorMessage}</span>
                </div>
              )}
              <button
                onClick={handleCreateEntry}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded text-sm font-medium text-white transition-colors duration-150 disabled:bg-[#1a1a1a] disabled:text-[#666] disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                {isSubmitting ? "Creating..." : "Create Entry"}
              </button>
            </div>
          </div>
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

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