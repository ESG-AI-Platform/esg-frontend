export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserProfile {
  id: string;
  bio?: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "en" | "th";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
