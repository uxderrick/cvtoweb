export interface Experience {
  company: string;
  role: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  dates: string;
  location?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    website?: string;
    location?: string;
  };
  theme?: 'midnight' | 'snow' | 'cobalt';
  sectionOrder?: string[];
}

export interface Portfolio {
  id: string;
  user_id: string | null;
  username: string | null;
  portfolio_data: PortfolioData;
  template: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
