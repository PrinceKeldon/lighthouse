export type Database = {
  public: {
    Tables: {
      strengths: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          first_evidence_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          first_evidence_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          first_evidence_at?: string | null;
          created_at?: string;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          text_encrypted: string;
          strength_tags: string[];
          prompt_id: string | null;
          weight: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text_encrypted: string;
          strength_tags?: string[];
          prompt_id?: string | null;
          weight?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text_encrypted?: string;
          strength_tags?: string[];
          prompt_id?: string | null;
          weight?: number | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          user_id: string;
          tier: 'free' | 'plus' | 'founding_supporter';
          updated_at: string;
        };
        Insert: {
          user_id: string;
          tier?: 'free' | 'plus' | 'founding_supporter';
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          tier?: 'free' | 'plus' | 'founding_supporter';
          updated_at?: string;
        };
      };
    };
  };
};
