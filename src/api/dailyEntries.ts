import { supabase } from "../supabase";
import { formatDateForPath, generateMarkdownContent } from "../utils/dateUtils";

// --- Type Definitions ---

export interface DailyEntry {
  id: string;
  date: string;
  title: string;
  description: string | null;
  blog_url: string | null;
  markdown_path: string;
  attachments: string[];
  references: string[];
  created_at: string;
  updated_at: string;
}

export type NewDailyEntry = Pick<
  DailyEntry,
  "date" | "title" | "description" | "blog_url" | "attachments" | "references"
>;

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
   * Creates a new daily entry.
   * @param entryData The data for the new entry.
   */
  async createEntry(
    entryData: NewDailyEntry
  ): Promise<ApiResponse<DailyEntry>> {
    try {
      const uniqueSuffix = Date.now();
      const { path } = formatDateForPath(entryData.date);
      const finalPath = `${path}-${uniqueSuffix}.md`;
      const markdownContent = generateMarkdownContent(entryData);

      // 1. Upload markdown to storage
      const { error: uploadError } = await supabase.storage
        .from("daily-entries")
        .upload(finalPath, new Blob([markdownContent], { type: "text/markdown" }));

      if (uploadError) throw uploadError;

      // 2. Insert metadata into the database
      const { data, error: dbError } = await supabase
        .from("daily_entries")
        .insert([
          {
            ...entryData,
            markdown_path: path,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single(); // .single() is great here to get the object directly

      if (dbError) throw dbError;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error creating entry:", error.message);
      return { success: false, error };
    }
  },

  // You can continue adding your other typed functions here.
};
