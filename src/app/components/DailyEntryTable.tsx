"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Calendar,
  FileText,
  Link2,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { dailyEntriesAPI, DailyEntry } from "@/api/dailyEntries";

interface DailyEntriesTableProps {
  selectedDate?: string;
  onDateClear?: () => void;
}

const DailyEntriesTable = ({
  selectedDate,
  onDateClear,
}: DailyEntriesTableProps) => {
  // --- State and Hooks ---
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const router = useRouter(); // Next.js router for navigation

  // --- Data Fetching ---
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      const result = await dailyEntriesAPI.getEntries();

      if (result.success) {
        setEntries(result.data);
      } else {
        setError(result.error.message);
        console.error("Failed to fetch entries:", result.error.message);
      }
      setLoading(false);
    };

    fetchEntries();
  }, []);

  // --- Memoized Filtering ---
  const filteredEntries = useMemo(() => {
    if (!selectedDate) return entries;

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().split("T")[0];
      const filterDate = new Date(selectedDate).toISOString().split("T")[0];
      return entryDate === filterDate;
    });
  }, [entries, selectedDate]);

  // --- Helper Functions ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEntriesCountText = () => {
    if (selectedDate) {
      const selectedDateFormatted = new Date(selectedDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      return `${filteredEntries.length} ${
        filteredEntries.length === 1 ? "entry" : "entries"
      } for ${selectedDateFormatted}`;
    }
    return `${filteredEntries.length} total ${
      filteredEntries.length === 1 ? "entry" : "entries"
    }`;
  };

  // --- Event Handlers ---
  const handleEntryClick = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  /**
   * Navigates to the internal blog page to render the markdown.
   * @param markdownPath The path to the markdown file in Supabase storage.
   */
const handleViewPost = (markdownPath: string | null) => {
  if (markdownPath) {
    // This line is the key. It removes ".md" from the end of the path.
    const pathWithoutExtension = markdownPath.replace(/\.md$/, "");
    
    // This sends a "clean" slug to the URL, like "2025-08-08-1754663790616"
    router.push(`/blog/${pathWithoutExtension}`);
  }
};
  /**
   * Opens an external URL in a new tab.
   * @param url The external URL to open.
   */
  const handleExternalLink = (url: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // --- Render Logic ---
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] overflow-hidden">
        <div className="border-b border-[#1a1a1a] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#e5e5e5] flex items-center gap-2">
              <FileText size={20} />
              Daily Entries
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
              {selectedDate && (
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-full">
                  <Filter size={14} />
                  <span>Filtered</span>
                  <button
                    onClick={onDateClear}
                    className="hover:text-[#e5e5e5] transition-colors"
                    title="Clear filter"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <span>{getEntriesCountText()}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f0f0f] border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider text-[#666666] font-medium w-40">
                  Date
                </th>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider text-[#666666] font-medium">
                  Title
                </th>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider text-[#666666] font-medium w-32">
                  Attachments
                </th>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider text-[#666666] font-medium w-32">
                  References
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#666]">
                    <Loader2 className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <p className="text-[#666]">
                      {selectedDate
                        ? "No entries found for the selected date."
                        : "No entries found."}
                    </p>
                    {selectedDate && onDateClear && (
                      <button
                        onClick={onDateClear}
                        className="mt-2 text-sm text-blue-500 hover:text-blue-400 underline"
                      >
                        Show all entries
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry: DailyEntry) => (
                  <React.Fragment key={entry.id}>
                    <tr
                      className={`border-b border-[#1a1a1a] hover:bg-[#111111] cursor-pointer transition-colors duration-150 ${
                        selectedDate ? "bg-[#0f0f0f]" : ""
                      }`}
                      onClick={() => handleEntryClick(entry.id)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 text-[#a0a0a0] text-sm">
                          <Calendar size={16} />
                          {formatDate(entry.date)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#e5e5e5] font-medium text-sm">
                        {entry.title}
                      </td>
                      <td className="py-4 px-6 text-[#a0a0a0] text-sm">
                        {entry.attachments.length} files
                      </td>
                      <td className="py-4 px-6 text-[#a0a0a0] text-sm">
                        {entry.references.length} refs
                      </td>
                      <td className="py-4 px-6">
                        <ChevronRight
                          size={16}
                          className={`text-[#666666] transition-transform duration-200 ${
                            expandedEntry === entry.id ? "rotate-90" : ""
                          }`}
                        />
                      </td>
                    </tr>
                    {expandedEntry === entry.id && (
                      <tr className="bg-[#0f0f0f] border-b border-[#1a1a1a]">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-[#e5e5e5] mb-2">
                                Description
                              </h4>
                              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                                {entry.description ||
                                  "No description provided."}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-[#e5e5e5] mb-2 flex items-center gap-2">
                                  <FileText size={14} />
                                  Attachments
                                </h4>
                                <div className="space-y-1">
                                  {entry.attachments.length > 0 ? (
                                    entry.attachments.map((file, i) => (
                                      <div
                                        key={i}
                                        className="text-sm text-[#a0a0a0] bg-[#1a1a1a] px-3 py-2 rounded"
                                      >
                                        {file}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-[#666666] italic">
                                      No attachments
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-[#e5e5e5] mb-2 flex items-center gap-2">
                                  <Link2 size={14} />
                                  References
                                </h4>
                                <div className="space-y-1">
                                  {entry.references.length > 0 ? (
                                    entry.references.map((ref, i) => (
                                      <div
                                        key={i}
                                        className="text-sm text-[#a0a0a0] bg-[#1a1a1a] px-3 py-2 rounded"
                                      >
                                        {ref}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-[#666666] italic">
                                      No references
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-[#1a1a1a]">
                              {entry.markdown_path && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewPost(entry.markdown_path);
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:cursor-pointer border border-transparent rounded text-sm font-medium text-white transition-colors duration-150"
                                >
                                  <FileText size={14} />
                                  View Post
                                </button>
                              )}
                              {entry.blog_url && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExternalLink(entry.blog_url);
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm font-medium text-[#e5e5e5] transition-colors duration-150"
                                >
                                  <ExternalLink size={14} />
                                  Open External Link
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyEntriesTable;
