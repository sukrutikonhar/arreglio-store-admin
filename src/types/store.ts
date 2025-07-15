export interface NavigationItem {
  id: string;
  name: string;
  link: string;
  hasSubmenu: boolean;
  submenu: NavigationItem[];
}

export interface FormData {
  storeName: string;
  navigationLinks: NavigationItem[];
  heroTitle: string;
  services: { name: string; link: string; icon: File | null }[];
  whatWeDo: string;
  ourTeamDescription: string;
  ourTeamCTA: string;
  ourTeamCTALink: string;
  teamMembers: { profilePicture: File | null; name: string; designation: string; socials: { icon: string; url: string }[] }[];
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  howItWorksSteps: { title: string; description: string }[];
  statisticsStats: { value: string; suffix: string; title: string }[];
  testimonialsList: { rating: number; testimonial: string; name: string; designation: string; company: string }[];
  testimonialsSectionTitle?: string;
  testimonialsSectionDescription?: string;
  contactInfoTitle: string;
  contactInfoDescription: string;
  contactMethods: { icon: string; label: string; value: string }[];
  contactFormName: string;
  contactFormEmail: string;
  contactFormSubject: string;
  contactFormMessage: string;
  contactFormCheckboxOptions: string[];
  contactFormCheckboxSelected: string[];
  contactFormSubmitLabel: string;
  blogSectionTitle: string;
  blogSectionSubtitle: string;
  blogPosts: {
    image: File | string | null;
    date: string;
    comment: string;
    title: string;
    description: string;
    link?: string;
  }[];
  footerAbout: string;
  footerLinks: { label: string; url: string }[];
  footerServices: { label: string; url: string }[];
  footerSocials: { icon: string; url: string }[];
  footerCopyright: string;
  footerPolicies: { label: string; url: string }[];
  // Contact section fields
  phoneNumber: string;
  email: string;
  address: string;
  contactForm: string[];
  // File uploads
  backgroundImage: File | null;
  aboutUsImage: File | null;
  // Add dynamic contact form fields
  contactFormFields?: Array<{
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    width?: "full" | "half" | "third";
    options?: string[];
  }>;
  storeLogo: File | string | null;
  storeLogoSticky: File | string | null;
}

export interface StoreConfig {
  id: string;
  domain: string;
  config: FormData;
  createdAt: string;
  updatedAt: string;
}
