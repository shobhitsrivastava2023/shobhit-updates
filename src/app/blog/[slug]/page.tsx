"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { dailyEntriesAPI } from "@/api/dailyEntries";
import ReactMarkdown from "react-markdown";
import { Loader2, ChevronLeft, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

const formatDateFromSlug = (slug: string): string => {
  const datePart = slug.split("-").slice(0, 3).join("-");
  const date = new Date(datePart);
  if (isNaN(date.getTime())) {
    return "Date not available";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BlogPost = () => {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (!slug) return;

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const markdownPath = `${slug}.md`;
        const result = await dailyEntriesAPI.getMarkdownContent(markdownPath);

        if (result.success) {
          setContent(result.data);
        } else {
          setError(
            `Could not load the post. (${result.error?.message || "Unknown error"})`
          );
        }
      } catch (err) {
        setError("A critical error occurred while fetching the post.");
        console.error("Fetch content error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  const formattedDate = useMemo(
    () => (slug ? formatDateFromSlug(slug) : ""),
    [slug]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#666666]" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-lg font-semibold text-[#e5e5e5]">
            Post Not Found
          </h1>
          <p className="mt-2 text-sm text-[#a0a0a0]">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-sm text-[#e5e5e5] transition-colors"
          >
            <ChevronLeft size={14} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#a0a0a0] hover:text-[#e5e5e5] transition-colors"
          >
            <ChevronLeft size={14} />
            All Entries
          </Link>

          <div className="flex items-center gap-2 mt-3 text-[#a0a0a0] text-sm">
            <Calendar size={14} />
            <time>{formattedDate}</time>
          </div>
        </header>

        <article
          className="font-mono space-y-6 prose prose-invert max-w-none
    prose-headings:font-semibold prose-headings:tracking-tight prose-headings:mb-3
    prose-p:leading-relaxed prose-p:mb-4 prose-p:text-[#c9c9c9]
    prose-a:text-blue-400 hover:prose-a:underline
    prose-blockquote:border-l-[#333] prose-blockquote:pl-4 prose-blockquote:text-[#b0b0b0]
    prose-strong:text-[#fff]
    prose-code:text-[#f87171] prose-code:bg-[#1a1a1a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
    prose-pre:bg-[#111] prose-pre:rounded-lg prose-pre:p-4 prose-pre:text-sm prose-pre:overflow-x-auto"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
};

export default BlogPost;
