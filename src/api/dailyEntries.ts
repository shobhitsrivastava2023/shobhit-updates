import { supabase } from "../supabase";
import { formatDateForPath } from "../utils/dateUtils"; // Assuming generateMarkdownContent is no longer needed here

// --- Type Definitions ---

export interface DailyEntry {
  id: string;
  date: string;
  title: string;
  description: string | null;
  blog_url: string | null; // This can be deprecated or used for an optional external link
  markdown_path: string;
  attachments: string[];
  references: string[];
  created_at: string;
  updated_at: string;
}

// The form now provides the full markdown content directly
export type NewDailyEntry = {
  date: string;
  title: string;
  description: string | null;
  content: string; // The full markdown content from the admin panel
  attachments: string[];
  references: string[];
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

// --- API Implementation ---

export const dailyEntriesAPI = {
  /**
   * Fetches all entries from the database.
   */
  async getEntries(): Promise<ApiResponse<DailyEntry[]>> {
    try {
      const { data, error } = await supabase
        .from("daily_entries")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching entries:", error.message);
      return { success: false, error };
    }
  },

  /**
   * Fetches the content of a markdown file from Supabase storage.
   * @param path The full path to the markdown file.
   */
  async getMarkdownContent(path: string): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase.storage
        .from("daily-entries")
        .download(path);

      if (error) throw error;
      
      const content = await data.text();
      return { success: true, data: content };
    } catch (error: any) {
      console.error(`Error fetching markdown content for path: ${path}`, error.message);
      return { success: false, error };
    }
  },

  /**
   * Creates a new daily entry.
   * @param entryData The data for the new entry, including the markdown content.
   */
// In dailyEntries.ts - Fix the createEntry function
// In dailyEntries.ts - Fix the createEntry function

async createEntry(
  entryData: NewDailyEntry
): Promise<ApiResponse<DailyEntry>> {
  try {
    const { content, ...dbData } = entryData;
    
    // Create a simpler path structure without nested folders
    const date = new Date(entryData.date);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const uniqueSuffix = Date.now();
    
    // Simple flat structure: YYYY-MM-DD-timestamp.md
    const finalPath = `${dateStr}-${uniqueSuffix}.md`;

    // 1. Upload the user-provided markdown content to storage
    const { error: uploadError } = await supabase.storage
      .from("daily-entries")
      .upload(finalPath, new Blob([content], { type: "text/markdown" }));
    
    if (uploadError) throw uploadError;

    // 2. Insert metadata into the database
    const { data, error: dbError } = await supabase
      .from("daily_entries")
      .insert([
        {
          ...dbData,
          markdown_path: finalPath,
          updated_at: new Date().toISOString(),
          blog_url: null,
        },
      ])
      .select()
      .single();
    
    if (dbError) throw dbError;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating entry:", error.message);
    return { success: false, error };
  }
}
};