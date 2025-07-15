import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
// import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import { FormData } from '../types/store';
import { Checkbox } from 'primereact/checkbox';
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';

type Section = {
    id: string;
    label: string;
};

type ServiceItem = {
    name: string;
    link: string;
    icon: File | null;
};

const sections: Section[] = [
    { id: 'header-section', label: 'Header Section' },
    { id: 'hero-section', label: 'Hero Section' },
    { id: 'what-we-do', label: 'What We Do Section' },
    { id: 'our-team', label: 'Our Team Section' },
    { id: 'how-it-works', label: 'How it Works Section' },
    { id: 'statistics', label: 'Statistics Section' },
    { id: 'testimonials', label: 'Testimonials Section' },
    { id: 'contact-info', label: 'Contact Info Section' },
    { id: 'blog-section', label: 'Blog Section' },
    { id: 'footer-section', label: 'Footer Section' },
];

const allSocialOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'Pinterest', value: 'pinterest' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Telegram', value: 'telegram' },
    { label: 'Snapchat', value: 'snapchat' },
    { label: 'Reddit', value: 'reddit' },
    { label: 'Other', value: 'other' },
];

type WebsiteFormProps = {
    mandatorySections: string[];
    selectedOptionalSections: string[];
    onCancel: () => void;
    onSave: () => void;
};

type ContactFormField = {
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    width?: 'full' | 'half' | 'third';
    options?: string[];
};

// Utility to convert File to base64 data URL
const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

// Recursively convert all File fields in formData to data URLs
async function convertFormDataImages(formData: any) {
    const newFormData = { ...formData };

    // Store Logo
    if (formData.storeLogo instanceof File) {
        newFormData.storeLogo = await fileToDataUrl(formData.storeLogo);
    }

    // Background Image
    if (formData.backgroundImage instanceof File) {
        newFormData.backgroundImage = await fileToDataUrl(formData.backgroundImage);
    }

    // About Us Image
    if (formData.aboutUsImage instanceof File) {
        newFormData.aboutUsImage = await fileToDataUrl(formData.aboutUsImage);
    }

    // Team Members profilePicture
    if (Array.isArray(formData.teamMembers)) {
        newFormData.teamMembers = await Promise.all(formData.teamMembers.map(async (member: any) => {
            const newMember = { ...member };
            if (member.profilePicture instanceof File) {
                newMember.profilePicture = await fileToDataUrl(member.profilePicture);
            }
            return newMember;
        }));
    }

    // Services icons
    if (Array.isArray(formData.services)) {
        newFormData.services = await Promise.all(formData.services.map(async (service: any) => {
            const newService = { ...service };
            if (service.icon instanceof File) {
                newService.icon = await fileToDataUrl(service.icon);
            }
            return newService;
        }));
    }

    // Blog Posts images
    if (Array.isArray(formData.blogPosts)) {
        newFormData.blogPosts = await Promise.all(formData.blogPosts.map(async (post: any) => {
            const newPost = { ...post };
            if (post.image instanceof File) {
                newPost.image = await fileToDataUrl(post.image);
            }
            return newPost;
        }));
    }

    // Sticky Logo
    if (formData.storeLogoSticky instanceof File) {
        newFormData.storeLogoSticky = await fileToDataUrl(formData.storeLogoSticky);
    }

    return newFormData;
}

const WebsiteForm: React.FC<WebsiteFormProps> = ({ mandatorySections, selectedOptionalSections, onCancel, onSave }) => {
    // const navigate = useNavigate();
    const sectionRefs = sections.map(() => useRef<HTMLElement>(null));
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const toast = useRef<Toast>(null);
    const [publishedId, setPublishedId] = useState<string | null>(null);

    const onUpload = () => {
        toast.current?.show({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'File has been uploaded',
            life: 3000
        });
    };

    const [formData, setFormData] = useState<FormData>({
        storeName: '',
        storeLogo: null,
        storeLogoSticky: null,
        navigationLinks: [
            { id: '1', name: 'Home', link: '/', hasSubmenu: false, submenu: [] },
            { id: '2', name: 'About', link: '/about', hasSubmenu: false, submenu: [] },
            { id: '3', name: 'Contact', link: '/contact', hasSubmenu: false, submenu: [] }
        ],
        heroTitle: '',
        services: [
            { name: '', link: '', icon: null }
        ],
        whatWeDo: '',
        ourTeamDescription: '',
        phoneNumber: '',
        email: '',
        address: '',
        contactForm: [],
        backgroundImage: null,
        aboutUsImage: null,
        teamMembers: [{ profilePicture: null, name: '', designation: '', socials: [{ icon: '', url: '' }] }],
        ourTeamCTA: '',
        ourTeamCTALink: '',
        howItWorksTitle: 'HOW IT WORKS',
        howItWorksSubtitle: 'seamless service',
        howItWorksSteps: [{ title: 'STEP 01', description: '' }],
        statisticsStats: [
            { value: '', suffix: '', title: '' }
        ],
        testimonialsList: [
            { rating: 5, testimonial: '', name: '', designation: '', company: '' }
        ],
        contactInfoTitle: 'HOW TO FIND US',
        contactInfoDescription: '',
        contactMethods: [
            { icon: 'phone', label: 'Have any question?', value: '' },
            { icon: 'mail', label: 'Write email', value: '' },
            { icon: 'location', label: 'Visit anytime', value: '' }
        ],
        contactFormName: '',
        contactFormEmail: '',
        contactFormSubject: '',
        contactFormMessage: '',
        contactFormCheckboxOptions: ['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'],
        contactFormCheckboxSelected: [],
        contactFormSubmitLabel: 'Send Query',
        blogSectionTitle: 'BLOG',
        blogSectionSubtitle: 'Real customers reviews',
        blogPosts: [
            { image: null, date: '', comment: '', title: '', description: '' }
        ],
        footerAbout: '',
        footerLinks: [{ label: '', url: '' }],
        footerServices: [{ label: '', url: '' }],
        footerSocials: [{ icon: '', url: '' }],
        footerCopyright: '© Arreglio All rights Reserved.',
        footerPolicies: [{ label: 'Privacy Policy', url: '' }, { label: 'Terms & Condition', url: '' }],
        testimonialsSectionTitle: '',
        testimonialsSectionDescription: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (idx: number, field: keyof ServiceItem, value: any) => {
        setFormData(prev => {
            const updated = [...prev.services];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, services: updated };
        });
    };

    const handleAddService = () => {
        setFormData(prev => ({ ...prev, services: [...prev.services, { name: '', link: '', icon: null }] }));
    };

    const handleRemoveService = (idx: number) => {
        setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }));
    };

    const handleScroll = () => {
        const scrollPos = window.scrollY;
        sectionRefs.forEach((ref, index) => {
            if (ref.current) {
                const offsetTop = ref.current.offsetTop - 100;
                if (scrollPos >= offsetTop) {
                    setActiveSection(sections[index].id);
                }
            }
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionRefs]);

    const scrollToSection = (index: number) => {
        const element = sectionRefs[index].current;
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleNext = () => {
        onSave();
    };

    const truncateFileName = (filename: string): string => {
        const dotIndex = filename.lastIndexOf(".");
        if (dotIndex === -1) return filename; // no extension

        const name = filename.slice(0, dotIndex);
        const ext = filename.slice(dotIndex); // includes the "."

        if (name.length <= 10) return filename;

        const start = name.slice(0, 3);       // first 3 chars
        const end = name.slice(-3);           // last 3 before extension

        return `${start}...${end}${ext}`;
    };

    // Combine mandatory and selected optional sections for preview
    const selectedSections = [
        ...mandatorySections,
        ...selectedOptionalSections.map(
            s => {
                // Map camelCase to Title Case for section names
                if (s === 'ourTeam') return 'Our Team';
                if (s === 'howItWorks') return 'How It Works';
                if (s === 'statistics') return 'Statistics';
                if (s === 'testimonials') return 'Testimonials';
                if (s === 'contactInfo') return 'Contact Info';
                if (s === 'blogSection') return 'Blog Section';
                if (s === 'footerSection') return 'Footer Section';
                return s;
            }
        )
    ];

    const handleTeamMemberChange = (idx: number, field: 'profilePicture' | 'name' | 'designation', value: any) => {
        setFormData(prev => {
            const updated = [...prev.teamMembers];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, teamMembers: updated };
        });
    };
    const handleTeamMemberSocialChange = (memberIdx: number, socialIdx: number, field: 'icon' | 'url', value: string) => {
        setFormData(prev => {
            const updated = [...prev.teamMembers];
            const socials = [...(updated[memberIdx].socials || [])];
            socials[socialIdx] = { ...socials[socialIdx], [field]: value };
            updated[memberIdx] = { ...updated[memberIdx], socials };
            return { ...prev, teamMembers: updated };
        });
    };
    const handleAddTeamMemberSocial = (memberIdx: number) => {
        setFormData(prev => {
            const updated = [...prev.teamMembers];
            const socials = [...(updated[memberIdx].socials || [])];
            socials.push({ icon: '', url: '' });
            updated[memberIdx] = { ...updated[memberIdx], socials };
            return { ...prev, teamMembers: updated };
        });
    };
    const handleRemoveTeamMemberSocial = (memberIdx: number, socialIdx: number) => {
        setFormData(prev => {
            const updated = [...prev.teamMembers];
            const socials = [...(updated[memberIdx].socials || [])];
            updated[memberIdx] = { ...updated[memberIdx], socials: socials.filter((_, i) => i !== socialIdx) };
            return { ...prev, teamMembers: updated };
        });
    };
    const handleAddTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { profilePicture: null, name: '', designation: '', socials: [{ icon: '', url: '' }] }]
        }));
    };

    const handleRemoveTeamMember = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== idx)
        }));
    };

    const handleHowItWorksStepChange = (idx: number, field: 'title' | 'description', value: string) => {
        setFormData(prev => {
            const updated = [...prev.howItWorksSteps];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, howItWorksSteps: updated };
        });
    };

    const handleStatisticsStatChange = (idx: number, field: 'value' | 'suffix' | 'title', value: string) => {
        setFormData(prev => {
            const updated = [...prev.statisticsStats];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, statisticsStats: updated };
        });
    };

    const handleAddStatisticsStat = () => {
        setFormData(prev => ({
            ...prev,
            statisticsStats: [...prev.statisticsStats, { value: '', suffix: '', title: '' }]
        }));
    };

    const handleRemoveStatisticsStat = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            statisticsStats: prev.statisticsStats.filter((_, i) => i !== idx)
        }));
    };

    const handleTestimonialChange = (idx: number, field: 'rating' | 'testimonial' | 'name' | 'designation' | 'company', value: any) => {
        setFormData(prev => {
            const updated = [...prev.testimonialsList];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, testimonialsList: updated };
        });
    };

    const handleAddTestimonial = () => {
        setFormData(prev => ({
            ...prev,
            testimonialsList: [...prev.testimonialsList, { rating: 5, testimonial: '', name: '', designation: '', company: '' }]
        }));
    };

    const handleRemoveTestimonial = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            testimonialsList: prev.testimonialsList.filter((_, i) => i !== idx)
        }));
    };

    const handleContactMethodChange = (idx: number, field: 'icon' | 'label' | 'value', value: string) => {
        setFormData(prev => {
            const updated = [...prev.contactMethods];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, contactMethods: updated };
        });
    };

    const handleAddContactMethod = () => {
        setFormData(prev => ({
            ...prev,
            contactMethods: [...prev.contactMethods, { icon: '', label: '', value: '' }]
        }));
    };

    const handleRemoveContactMethod = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            contactMethods: prev.contactMethods.filter((_, i) => i !== idx)
        }));
    };

    const handleContactFormFieldChange = (field: 'contactInfoTitle' | 'contactInfoDescription' | 'contactFormName' | 'contactFormEmail' | 'contactFormSubject' | 'contactFormMessage' | 'contactFormSubmitLabel', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBlogPostChange = (idx: number, field: 'image' | 'date' | 'comment' | 'title' | 'description' | 'link', value: any) => {
        setFormData(prev => {
            const updated = [...prev.blogPosts];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, blogPosts: updated };
        });
    };

    const handleAddBlogPost = () => {
        setFormData(prev => ({
            ...prev,
            blogPosts: [...prev.blogPosts, { image: null, date: '', comment: '', title: '', description: '', link: '' }]
        }));
    };

    const handleRemoveBlogPost = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            blogPosts: prev.blogPosts.filter((_, i) => i !== idx)
        }));
    };

    const handleFooterListChange = (list: 'footerLinks' | 'footerServices' | 'footerSocials' | 'footerPolicies', idx: number, field: string, value: string) => {
        setFormData(prev => {
            const updated = [...prev[list]];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, [list]: updated };
        });
    };

    const handleAddFooterListItem = (list: 'footerLinks' | 'footerServices' | 'footerSocials' | 'footerPolicies', item: any) => {
        setFormData(prev => ({ ...prev, [list]: [...prev[list], item] }));
    };

    const handleRemoveFooterListItem = (list: 'footerLinks' | 'footerServices' | 'footerSocials' | 'footerPolicies', idx: number) => {
        setFormData(prev => ({ ...prev, [list]: prev[list].filter((_, i) => i !== idx) }));
    };

    const fieldTypeOptions = [
        { label: 'Text', value: 'text' },
        { label: 'Tel', value: 'tel' },
        { label: 'Email', value: 'email' },
        { label: 'Number', value: 'number' },
        { label: 'Date', value: 'date' },
        { label: 'Dropdown (Select)', value: 'dropdown' },
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'Textarea', value: 'textarea' },
        { label: 'URL', value: 'url' },
    ];
    const columnWidthOptions = [
        { label: 'Full', value: 'full' },
        { label: 'Half', value: 'half' },
        { label: 'Third', value: 'third' },
    ];
    const [contactFormFields, setContactFormFields] = useState<ContactFormField[]>([]);
    const [newField, setNewField] = useState<{
        type: string;
        label: string;
        placeholder: string;
        required: boolean;
        width: 'full' | 'half' | 'third';
        options: string[];
        optionsInput: string;
        editIndex: number | null;
    }>({
        type: '',
        label: '',
        placeholder: '',
        required: false,
        width: 'full',
        options: [],
        optionsInput: '',
        editIndex: null,
    });

    const handleAddOrEditField = () => {
        if (!newField.type || !newField.label) return;
        const fieldData: ContactFormField = {
            type: newField.type,
            label: newField.label,
            placeholder: newField.placeholder,
            required: newField.required,
            width: newField.width,
            options: (newField.type === 'dropdown' || newField.type === 'checkbox') ? newField.options : undefined,
        };
        if (newField.editIndex !== null) {
            setContactFormFields(fields => fields.map((f, i) => i === newField.editIndex ? fieldData : f));
        } else {
            setContactFormFields(fields => [...fields, fieldData]);
        }
        setNewField({ type: '', label: '', placeholder: '', required: false, width: 'full', options: [], optionsInput: '', editIndex: null });
    };
    const handleEditField = (idx: number) => {
        const field = contactFormFields[idx];
        setNewField({
            type: field.type,
            label: field.label,
            placeholder: field.placeholder || '',
            required: field.required || false,
            width: field.width || 'full',
            options: field.options || [],
            optionsInput: (field.options || []).join(', '),
            editIndex: idx,
        });
    };
    const handleDeleteField = (idx: number) => {
        setContactFormFields(fields => fields.filter((_, i) => i !== idx));
        if (newField.editIndex === idx) setNewField({ type: '', label: '', placeholder: '', required: false, width: 'full', options: [], optionsInput: '', editIndex: null });
    };

    React.useEffect(() => {
        setFormData(prev => ({ ...prev, contactFormFields }));
    }, [contactFormFields]);

    const contactIconOptions = [
        { value: 'phone', label: 'Phone', icon: <HiOutlinePhone className="w-5 h-5" /> },
        { value: 'mail', label: 'Email', icon: <HiOutlineEnvelope className="w-5 h-5" /> },
        { value: 'location', label: 'Location', icon: <HiOutlineMapPin className="w-5 h-5" /> },
        { value: 'clock', label: 'Clock', icon: <span className="w-5 h-5">🕒</span> },
        { value: 'other', label: 'Other', icon: <span className="w-5 h-5">📋</span> },
    ];

    const [openIconPanelIdx, setOpenIconPanelIdx] = useState<number | null>(null);
    const iconPanelRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Close panel on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (openIconPanelIdx !== null) {
                const ref = iconPanelRefs.current[openIconPanelIdx];
                if (ref && !ref.contains(event.target as Node)) {
                    setOpenIconPanelIdx(null);
                }
            }
        }
        if (openIconPanelIdx !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openIconPanelIdx]);

    const handleAddNavigationItem = () => {
        const newId = String(Date.now());
        setFormData(prev => ({
            ...prev,
            navigationLinks: [...prev.navigationLinks, {
                id: newId,
                name: '',
                link: '',
                hasSubmenu: false,
                submenu: []
            }]
        }));
    };

    const handleRemoveNavigationItem = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            navigationLinks: prev.navigationLinks.filter((_, i) => i !== idx)
        }));
    };

    const handleNavigationItemChange = (idx: number, field: 'name' | 'link' | 'hasSubmenu', value: any) => {
        setFormData(prev => {
            const updated = [...prev.navigationLinks];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, navigationLinks: updated };
        });
    };

    const handleAddSubmenuItem = (parentIdx: number) => {
        const newId = String(Date.now());
        setFormData(prev => {
            const updated = [...prev.navigationLinks];
            updated[parentIdx] = {
                ...updated[parentIdx],
                submenu: [...updated[parentIdx].submenu, {
                    id: newId,
                    name: '',
                    link: '',
                    hasSubmenu: false,
                    submenu: []
                }]
            };
            return { ...prev, navigationLinks: updated };
        });
    };

    const handleRemoveSubmenuItem = (parentIdx: number, subIdx: number) => {
        setFormData(prev => {
            const updated = [...prev.navigationLinks];
            updated[parentIdx] = {
                ...updated[parentIdx],
                submenu: updated[parentIdx].submenu.filter((_, i) => i !== subIdx)
            };
            return { ...prev, navigationLinks: updated };
        });
    };

    const handleSubmenuItemChange = (parentIdx: number, subIdx: number, field: 'name' | 'link', value: string) => {
        setFormData(prev => {
            const updated = [...prev.navigationLinks];
            updated[parentIdx] = {
                ...updated[parentIdx],
                submenu: updated[parentIdx].submenu.map((item, i) =>
                    i === subIdx ? { ...item, [field]: value } : item
                )
            };
            return { ...prev, navigationLinks: updated };
        });
    };

    const handlePublish = async () => {
        // Generate a unique ID (timestamp-based for demo)
        const id = 'store-' + Date.now();
        const formDataWithImages = await convertFormDataImages(formData);
        const storeData = {
            formData: { ...formDataWithImages, contactFormFields },
            selectedSections
        };
        localStorage.setItem(id, JSON.stringify(storeData));
        setPublishedId(id);
    };

    // Add real-time previewData update effect
    useEffect(() => {
        (async () => {
            const formDataWithImages = await convertFormDataImages(formData);
            const previewData = {
                formData: { ...formDataWithImages, contactFormFields },
                selectedSections
            };
            localStorage.setItem('previewData', JSON.stringify(previewData));
        })();
    }, [formData, contactFormFields, selectedSections]);

    return (
        <div className="doc-tabpanel">
            <Toast ref={toast} />

            <ul className="doc-section-nav">
                {sections.map((section, index) => (
                    <li
                        key={section.id}
                        className={`navbar-item ${activeSection === section.id ? 'active-navbar-item' : ''}`}
                    >
                        <div className="navbar-item-content">
                            <button className="px-link text-left" onClick={() => scrollToSection(index)}>
                                {section.label}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="doc-main">
                {sections.map((section, index) => (
                    <section key={section.id} id={section.id} ref={sectionRefs[index]} className="pb-10">
                        <h5 className="doc-section-label website-title mb-4">{section.label}</h5>
                        <div className="doc-section-description">
                            {section.id === 'header-section' && (
                                <div className="space-y-8">

                                    {/* Row 1: Store Name + Logos (3 equal columns) */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Store Name */}
                                        <div>
                                            <label>Store Name*</label>
                                            <InputText
                                                name="storeName"
                                                className="w-full"
                                                placeholder="Enter store name"
                                                value={formData.storeName}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Logo (Light/Normal) */}
                                        <div>
                                            <label>Logo (Light/Normal)</label>
                                            <FileUpload
                                                mode="basic"
                                                name="storeLogo"
                                                accept="image/*"
                                                maxFileSize={1000000}
                                                chooseLabel={formData.storeLogo ? 'Change Logo' : 'Upload Logo'}
                                                onUpload={onUpload}
                                                auto
                                                className="p-button-sm w-full"
                                                onSelect={(e) => {
                                                    const file = e.files[0];
                                                    setFormData(prev => ({ ...prev, storeLogo: file }));
                                                }}
                                            />
                                            {formData.storeLogo && (
                                                <img
                                                    src={typeof formData.storeLogo === 'string' ? formData.storeLogo : URL.createObjectURL(formData.storeLogo)}
                                                    alt="Store Logo Preview"
                                                    className="h-12 mt-2 rounded shadow border"
                                                    style={{ maxWidth: '120px', objectFit: 'contain', background: '#fff' }}
                                                />
                                            )}
                                        </div>

                                        {/* Sticky Logo */}
                                        <div>
                                            <label>Sticky Logo (Dark/Scrolled)</label>
                                            <FileUpload
                                                mode="basic"
                                                name="storeLogoSticky"
                                                accept="image/*"
                                                maxFileSize={1000000}
                                                chooseLabel={formData.storeLogoSticky ? 'Change Sticky Logo' : 'Upload Sticky Logo'}
                                                onUpload={onUpload}
                                                auto
                                                className="p-button-sm w-full"
                                                onSelect={(e) => {
                                                    const file = e.files[0];
                                                    setFormData(prev => ({ ...prev, storeLogoSticky: file }));
                                                }}
                                            />
                                            {formData.storeLogoSticky && (
                                                <img
                                                    src={typeof formData.storeLogoSticky === 'string' ? formData.storeLogoSticky : URL.createObjectURL(formData.storeLogoSticky)}
                                                    alt="Sticky Logo Preview"
                                                    className="h-12 mt-2 rounded shadow border"
                                                    style={{ maxWidth: '120px', objectFit: 'contain', background: '#fff' }}
                                                />
                                            )}
                                        </div>
                                    </div>


                                    {/* Navigation Menu */}
                                    <div>
                                        <label className="block mb-2">Navigation Menu*</label>
                                        <div className="space-y-4">
                                            {formData.navigationLinks.map((item, idx) => (
                                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    {/* Menu Item */}
                                                    <div className="flex gap-4 items-center mb-3">
                                                        <InputText
                                                            className="flex-1"
                                                            placeholder="Menu Item Name"
                                                            value={item.name}
                                                            onChange={e => handleNavigationItemChange(idx, 'name', e.target.value)}
                                                        />
                                                        <InputText
                                                            className="flex-1"
                                                            placeholder="Menu Item Link (e.g. /about)"
                                                            value={item.link}
                                                            onChange={e => handleNavigationItemChange(idx, 'link', e.target.value)}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                inputId={`hasSubmenu-${idx}`}
                                                                checked={item.hasSubmenu}
                                                                onChange={e => handleNavigationItemChange(idx, 'hasSubmenu', e.checked)}
                                                            />
                                                            <label htmlFor={`hasSubmenu-${idx}`} className="text-sm">Has Submenu</label>
                                                        </div>
                                                        {formData.navigationLinks.length > 1 && (
                                                            <Button
                                                                className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                                onClick={() => handleRemoveNavigationItem(idx)}
                                                                type="button"
                                                                title="Remove Menu Item"
                                                                style={{
                                                                    padding: '0.5rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <TrashIcon className="w-5 h-5 text-red-600" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {/* Submenu Items */}
                                                    {item.hasSubmenu && (
                                                        <div className="ml-6 space-y-2">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-medium">Submenu Items:</span>
                                                                <Button
                                                                    label="+Add Submenu Item"
                                                                    className="p-button-link text-secondary"
                                                                    onClick={() => handleAddSubmenuItem(idx)}
                                                                />
                                                            </div>
                                                            {item.submenu.map((subItem, subIdx) => (
                                                                <div key={subItem.id} className="flex gap-4 items-center bg-white p-2 rounded">
                                                                    <InputText
                                                                        className="flex-1"
                                                                        placeholder="Submenu Item Name"
                                                                        value={subItem.name}
                                                                        onChange={e => handleSubmenuItemChange(idx, subIdx, 'name', e.target.value)}
                                                                    />
                                                                    <InputText
                                                                        className="flex-1"
                                                                        placeholder="Submenu Item Link"
                                                                        value={subItem.link}
                                                                        onChange={e => handleSubmenuItemChange(idx, subIdx, 'link', e.target.value)}
                                                                    />
                                                                    <Button
                                                                        className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                                        onClick={() => handleRemoveSubmenuItem(idx, subIdx)}
                                                                        type="button"
                                                                        title="Remove Submenu Item"
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        <TrashIcon className="w-5 h-5 text-red-600" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                label="+Add Menu Item"
                                                className="p-button-link text-secondary"
                                                onClick={handleAddNavigationItem}
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}

                            {section.id === 'hero-section' && (
                                <div className='space-y-6'>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label>Title*</label>
                                            <InputText
                                                name="heroTitle"
                                                className="w-full"
                                                placeholder="Enter hero title"
                                                value={formData.heroTitle}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label>Background Image*</label>
                                            <div className="space-y-2">
                                                <FileUpload
                                                    mode="basic"
                                                    name="backgroundImage"
                                                    accept="image/*"
                                                    maxFileSize={1000000}
                                                    chooseLabel="Upload Background Image"
                                                    onUpload={onUpload}
                                                    auto
                                                    className="p-button-sm"
                                                    onSelect={(e) => {
                                                        const file = e.files[0];
                                                        setFormData(prev => ({ ...prev, backgroundImage: file }));
                                                    }}
                                                />
                                                <span className="text-secondGray">
                                                    {formData.backgroundImage?.name || 'No file chosen'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2">Services*</label>
                                        {formData.services.map((service, idx) => (
                                            <div key={idx} className="flex items-center gap-4 mb-2 w-full">
                                                {/* Name input */}
                                                <InputText
                                                    className="flex-1"
                                                    placeholder="Name of service"
                                                    value={service.name}
                                                    onChange={e => handleServiceChange(idx, 'name', e.target.value)}
                                                />

                                                {/* Link input */}
                                                <InputText
                                                    className="flex-1"
                                                    placeholder="Link to CTA"
                                                    value={service.link}
                                                    onChange={e => handleServiceChange(idx, 'link', e.target.value)}
                                                />

                                                {/* Upload button with fixed width */}
                                                <div className="w-[200px]">
                                                    <FileUpload
                                                        mode="basic"
                                                        name={`icon-${idx}`}
                                                        accept="image/*"
                                                        maxFileSize={1000000}
                                                        chooseLabel={service.icon ? truncateFileName(service.icon.name) : 'Upload Icon'}
                                                        onUpload={onUpload}
                                                        auto
                                                        className="p-button-sm w-full"
                                                        onSelect={(e) => {
                                                            const file = e.files[0];
                                                            handleServiceChange(idx, 'icon', file);
                                                        }}
                                                    />
                                                </div>

                                                {/* Delete icon at the end */}
                                                {formData.services.length > 1 && (
                                                    <div className="ml-2">
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                            onClick={() => handleRemoveService(idx)}
                                                            type="button"
                                                            aria-label="Remove Service"
                                                            title="Remove"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            label="+Add more"
                                            className="p-button-link text-secondary mt-2"
                                            onClick={handleAddService}
                                        />
                                    </div>

                                </div>
                            )}

                            {section.id === 'what-we-do' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Right: Description */}
                                    <div>
                                        <label className="block mb-2">Description*</label>
                                        <InputTextarea
                                            name="whatWeDo"
                                            className="w-full min-h-[120px]"
                                            placeholder="Enter what we do precisely"
                                            value={formData.whatWeDo}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Left: Image upload */}
                                    <div>
                                        <label className="block mb-2">Section Image*</label>
                                        <FileUpload
                                            mode="basic"
                                            name="aboutUsImage"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            chooseLabel={formData.aboutUsImage ? truncateFileName(formData.aboutUsImage.name) : 'Upload Image'}
                                            onUpload={onUpload}
                                            auto
                                            className="p-button-sm w-full"
                                            onSelect={(e) => {
                                                const file = e.files[0];
                                                setFormData(prev => ({ ...prev, aboutUsImage: file }));
                                            }}
                                        />
                                        <span className="text-secondGray">
                                            {formData.aboutUsImage?.name ? truncateFileName(formData.aboutUsImage.name) : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {section.id === 'our-team' && (
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Row 1: Description (left), CTA+Link (right) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div>
                                            <label className="block mb-2">Description*</label>
                                            <InputTextarea
                                                name="ourTeamDescription"
                                                className="w-full min-h-[100px]"
                                                placeholder="Enter team section description"
                                                value={formData.ourTeamDescription}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Link to CTA*</label>
                                            <div className="flex gap-2 items-end">
                                                <InputText
                                                    name="ourTeamCTA"
                                                    className="w-full"
                                                    placeholder="CTA Button Text (e.g. Contact Us)"
                                                    value={formData.ourTeamCTA || ''}
                                                    onChange={handleInputChange}
                                                />
                                                <InputText
                                                    name="ourTeamCTALink"
                                                    className="w-full"
                                                    placeholder="CTA Link (e.g. /contact)"
                                                    value={formData.ourTeamCTALink || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Row 2+: Team Members */}
                                    <div>
                                        <label className="block mb-2">Team Members*</label>
                                        {formData.teamMembers && formData.teamMembers.map((member, idx) => (
                                            <div key={idx} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 bg-white p-4 rounded shadow-sm team-box">
                                                {/* Left: Photo, Name, Designation in one row */}
                                                <div className="flex flex-col gap-4">
                                                    {/* Row 1: Name & Designation */}
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <InputText
                                                            className="w-full md:w-1/2"
                                                            placeholder="Team Member Name"
                                                            value={member.name}
                                                            onChange={e => handleTeamMemberChange(idx, 'name', e.target.value)}
                                                        />
                                                        <InputText
                                                            className="w-full md:w-1/2"
                                                            placeholder="Designation"
                                                            value={member.designation}
                                                            onChange={e => handleTeamMemberChange(idx, 'designation', e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Row 2: Upload Button with Label */}
                                                    <div className="flex flex-col gap-1">
                                                        <FileUpload
                                                            mode="basic"
                                                            name={`profile-upload-${idx}`}
                                                            accept="image/*"
                                                            maxFileSize={1000000}
                                                            chooseLabel={
                                                                member.profilePicture
                                                                    ? typeof member.profilePicture === 'string'
                                                                        ? truncateFileName(member.profilePicture)
                                                                        : truncateFileName(member.profilePicture.name)
                                                                    : 'Upload Image'
                                                            }
                                                            onSelect={(e) => {
                                                                const file = e.files?.[0];
                                                                if (file) handleTeamMemberChange(idx, 'profilePicture', file);
                                                            }}
                                                            auto
                                                            className="p-button-sm w-full md:w-64"
                                                        />
                                                        <span className="text-secondGray text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[260px]">
                                                            {member.profilePicture?.name
                                                                ? typeof member.profilePicture === 'string'
                                                                    ? truncateFileName(member.profilePicture)
                                                                    : truncateFileName(member.profilePicture.name)
                                                                : 'No file chosen'}
                                                        </span>
                                                    </div>


                                                    {/* Delete Button (positioned absolutely) */}
                                                    {formData.teamMembers.length > 1 && (
                                                        <div className="absolute top-2 right-2 z-10">
                                                            <Button
                                                                className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                                onClick={() => handleRemoveTeamMember(idx)}
                                                                type="button"
                                                                aria-label="Remove Team Member"
                                                                title="Remove Member"
                                                                style={{
                                                                    padding: '0.5rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <TrashIcon className="w-5 h-5 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Socials */}
                                                <div>
                                                    <label className="block mb-2">Socials</label>
                                                    {member.socials && member.socials.map((social, sIdx) => (
                                                        <div key={sIdx} className="flex gap-2 mb-2 items-center">
                                                            <Dropdown
                                                                className="w-40"
                                                                placeholder="Select Social Platform"
                                                                value={social.icon}
                                                                options={allSocialOptions.filter(
                                                                    option =>
                                                                        !member.socials.some((s, i) => s.icon === option.value && i !== sIdx)
                                                                )}
                                                                onChange={e => handleTeamMemberSocialChange(idx, sIdx, 'icon', e.value)}
                                                                optionLabel="label"
                                                                optionValue="value"
                                                            />
                                                            <InputText
                                                                className="flex-1"
                                                                placeholder="URL"
                                                                value={social.url}
                                                                onChange={e => handleTeamMemberSocialChange(idx, sIdx, 'url', e.target.value)}
                                                            />
                                                            {member.socials.length > 1 && (
                                                                <Button
                                                                    className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                                    onClick={() => handleRemoveTeamMemberSocial(idx, sIdx)}
                                                                    type="button"
                                                                    aria-label="Remove Social"
                                                                    title="Remove"
                                                                    style={{
                                                                        padding: '0.5rem',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button
                                                        label="+Add Social"
                                                        className="p-button-link text-secondary mt-2"
                                                        onClick={() => handleAddTeamMemberSocial(idx)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            label="+Add Team Member"
                                            className="p-button-link text-secondary mt-2"
                                            onClick={handleAddTeamMember}
                                        />
                                    </div>
                                </div>
                            )}

                            {section.id === 'how-it-works' && (
                                <div className="space-y-6">
                                    {/* Row 1: Title and Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block mb-2">Section Title*</label>
                                            <InputText
                                                name="howItWorksTitle"
                                                className="w-full"
                                                placeholder="e.g. HOW IT WORKS"
                                                value={formData.howItWorksTitle}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Section Description</label>
                                            <InputTextarea
                                                name="howItWorksSubtitle"
                                                className="w-full"
                                                placeholder="e.g. seamless service"
                                                value={formData.howItWorksSubtitle}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    {/* Steps label and number input */}
                                    <div>
                                        <label className="block mb-2 font-semibold">Steps*</label>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span>Number of Steps:</span>
                                            <InputText
                                                type="number"
                                                min={1}
                                                max={20}
                                                className="w-20"
                                                value={String(formData.howItWorksSteps.length)}
                                                onChange={e => {
                                                    let n = parseInt(e.target.value, 10);
                                                    if (isNaN(n) || n < 1) n = 1;
                                                    if (n > 20) n = 20;
                                                    setFormData(prev => {
                                                        let steps = [...prev.howItWorksSteps];
                                                        if (n > steps.length) {
                                                            // Add new steps
                                                            for (let i = steps.length; i < n; i++) {
                                                                steps.push({ title: `STEP ${String(i + 1).padStart(2, '0')}`, description: '' });
                                                            }
                                                        } else if (n < steps.length) {
                                                            // Remove steps from end
                                                            steps = steps.slice(0, n);
                                                        }
                                                        // Re-number titles
                                                        steps = steps.map((s, i) => ({ ...s, title: `STEP ${String(i + 1).padStart(2, '0')}` }));
                                                        return { ...prev, howItWorksSteps: steps };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {formData.howItWorksSteps.map((step, idx) => (
                                                <FloatLabel key={idx}>
                                                    <InputTextarea
                                                        id={`howitworks-step-${idx}`}
                                                        value={step.description}
                                                        onChange={e => handleHowItWorksStepChange(idx, 'description', e.target.value)}
                                                        className="w-full"
                                                    />
                                                    <label htmlFor={`howitworks-step-${idx}`}>{`Step ${idx + 1} Description`}</label>
                                                </FloatLabel>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {section.id === 'statistics' && (
                                <div className="space-y-6">
                                    <label className="block mb-2">Statistics Counters*</label>
                                    {formData.statisticsStats.map((stat, idx) => (
                                        <div key={idx} className="flex gap-4 mb-2 items-center">
                                            <InputText
                                                className="w-32"
                                                placeholder="Value (e.g. 1500)"
                                                value={stat.value}
                                                onChange={e => handleStatisticsStatChange(idx, 'value', e.target.value)}
                                            />
                                            <InputText
                                                className="w-16"
                                                placeholder="Suffix (e.g. +, %, etc)"
                                                value={stat.suffix}
                                                onChange={e => handleStatisticsStatChange(idx, 'suffix', e.target.value)}
                                            />
                                            <InputText
                                                className="w-64"
                                                placeholder="Title (e.g. HAPPY CLIENT)"
                                                value={stat.title}
                                                onChange={e => handleStatisticsStatChange(idx, 'title', e.target.value)}
                                            />
                                            {formData.statisticsStats.length > 1 && (
                                                <Button
                                                    className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                    onClick={() => handleRemoveStatisticsStat(idx)}
                                                    type="button"
                                                    style={{
                                                        padding: '0.5rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        label="+Add Counter"
                                        className="p-button-link text-secondary mt-2"
                                        onClick={handleAddStatisticsStat}
                                    />
                                </div>
                            )}

                            {section.id === 'testimonials' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block mb-2">Section Title*</label>
                                            <InputText
                                                className="w-full"
                                                placeholder="e.g. WHAT PEOPLE SAY"
                                                value={formData.testimonialsSectionTitle || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, testimonialsSectionTitle: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Section Description*</label>
                                            <InputTextarea
                                                className="w-full"
                                                placeholder="e.g. Real customers reviews"
                                                value={formData.testimonialsSectionDescription || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, testimonialsSectionDescription: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <label className="block mb-2">Testimonials*</label>
                                    {formData.testimonialsList.map((testimonial, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 items-stretch bg-white p-4 rounded shadow-sm">
                                            {/* Left: Testimonial Text */}
                                            <div>
                                                <InputTextarea
                                                    className="w-full h-full"
                                                    placeholder="Testimonial text"
                                                    value={testimonial.testimonial}
                                                    onChange={e => handleTestimonialChange(idx, 'testimonial', e.target.value)}
                                                />
                                            </div>

                                            {/* Right: Other fields */}
                                            <div className="flex flex-col justify-between h-full gap-4">
                                                <div className="flex gap-4">
                                                    <InputText
                                                        className="w-24"
                                                        type="number"
                                                        min={1}
                                                        max={5}
                                                        placeholder="Rating"
                                                        value={testimonial.rating.toString()}
                                                        onChange={e => handleTestimonialChange(idx, 'rating', Number(e.target.value))}
                                                    />
                                                    <InputText
                                                        className="flex-1"
                                                        placeholder="Name"
                                                        value={testimonial.name}
                                                        onChange={e => handleTestimonialChange(idx, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputText
                                                        className="w-full"
                                                        placeholder="Designation"
                                                        value={testimonial.designation}
                                                        onChange={e => handleTestimonialChange(idx, 'designation', e.target.value)}
                                                    />
                                                    <InputText
                                                        className="w-full"
                                                        placeholder="Company"
                                                        value={testimonial.company}
                                                        onChange={e => handleTestimonialChange(idx, 'company', e.target.value)}
                                                    />
                                                </div>

                                                {formData.testimonialsList.length > 1 && (
                                                    <div className="flex justify-end">
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                            onClick={() => handleRemoveTestimonial(idx)}
                                                            type="button"
                                                            title="Remove Testimonial"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        label="+Add Testimonial"
                                        className="p-button-link text-secondary mt-2"
                                        onClick={handleAddTestimonial}
                                    />
                                </div>
                            )}

                            {section.id === 'contact-info' && (
                                <div className="space-y-10">
                                    {/* ✅ Row 1: Title and Description side-by-side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left: Section Title */}
                                        <div>
                                            <label className="block mb-2">Section Title*</label>
                                            <InputText
                                                name="contactInfoTitle"
                                                className="w-full"
                                                placeholder="e.g. HOW TO FIND US"
                                                value={formData.contactInfoTitle}
                                                onChange={e => handleContactFormFieldChange('contactInfoTitle', e.target.value)}
                                            />
                                        </div>

                                        {/* Right: Section Description */}
                                        <div>
                                            <label className="block mb-2">Section Description*</label>
                                            <InputTextarea
                                                name="contactInfoDescription"
                                                className="w-full"
                                                placeholder="Description"
                                                value={formData.contactInfoDescription}
                                                onChange={e => handleContactFormFieldChange('contactInfoDescription', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* ✅ Row 2: Contact Methods - Full Width */}
                                    <div>
                                        <label className="block mb-2">Contact Methods*</label>
                                        {formData.contactMethods.map((method, idx) => (
                                            <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center w-full relative">
                                                {/* Icon popover */}
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className={`p-2 rounded-full border ${method.icon ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 text-gray-600 border-gray-300'} hover:bg-green-100`}
                                                        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        onClick={() => setOpenIconPanelIdx(idx)}
                                                        title={contactIconOptions.find(opt => opt.value === method.icon)?.label || 'Select Icon'}
                                                    >
                                                        {contactIconOptions.find(opt => opt.value === method.icon)?.icon || <span className="w-5 h-5">?</span>}
                                                    </button>

                                                    {openIconPanelIdx === idx && (
                                                        <div
                                                            ref={el => { iconPanelRefs.current[idx] = el; }}
                                                            className="absolute z-20 bg-white border border-gray-200 rounded shadow-lg p-2 mt-2 left-0 min-w-[160px]"
                                                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
                                                        >
                                                            {contactIconOptions.map(opt => (
                                                                <button
                                                                    key={opt.value}
                                                                    type="button"
                                                                    className={`p-2 rounded-full border ${method.icon === opt.value ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 text-gray-600 border-gray-300'} hover:bg-green-100`}
                                                                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                    onClick={() => { handleContactMethodChange(idx, 'icon', opt.value); setOpenIconPanelIdx(null); }}
                                                                    title={opt.label}
                                                                >
                                                                    {opt.icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Label */}
                                                <InputText
                                                    className="min-w-[140px] max-w-[200px] w-full"
                                                    placeholder="Label"
                                                    value={method.label}
                                                    onChange={e => handleContactMethodChange(idx, 'label', e.target.value)}
                                                />

                                                {/* Value */}
                                                <InputText
                                                    className="w-full min-w-[260px] max-w-[320px]"
                                                    placeholder="Value"
                                                    value={method.value}
                                                    onChange={e => handleContactMethodChange(idx, 'value', e.target.value)}
                                                />


                                                {/* Remove Button */}
                                                {formData.contactMethods.length > 1 && (
                                                    <Button
                                                        className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                        onClick={() => handleRemoveContactMethod(idx)}
                                                        type="button"
                                                        aria-label="Remove Method"
                                                        title="Remove"
                                                        style={{
                                                            padding: '0.5rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <TrashIcon className="w-5 h-5 text-red-600" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            label="+Add Method"
                                            className="p-button-link text-secondary mt-2"
                                            onClick={handleAddContactMethod}
                                        />
                                    </div>

                                    {/* Row 2: Form Builder + Live Preview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left: Contact Form Builder */}
                                        <div>
                                            <h4 className="mb-2 font-semibold">Contact Form Builder</h4>
                                            <div className="p-4 bg-gray-50 rounded mb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Dropdown
                                                        className="w-full"
                                                        placeholder="Field Type"
                                                        value={newField.type}
                                                        options={fieldTypeOptions}
                                                        onChange={e => setNewField(f => ({ ...f, type: e.value, options: [], optionsInput: '' }))}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    <InputText
                                                        className="w-full"
                                                        placeholder="Label*"
                                                        value={newField.label}
                                                        onChange={e => setNewField(f => ({ ...f, label: e.target.value }))}
                                                    />
                                                    <InputText
                                                        className="w-full"
                                                        placeholder="Placeholder"
                                                        value={newField.placeholder}
                                                        onChange={e => setNewField(f => ({ ...f, placeholder: e.target.value }))}
                                                    />
                                                    <Dropdown
                                                        className="w-full"
                                                        placeholder="Column Width"
                                                        value={newField.width}
                                                        options={columnWidthOptions}
                                                        onChange={e => setNewField(f => ({ ...f, width: e.value }))}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />
                                                    {(newField.type === 'dropdown' || newField.type === 'checkbox') && (
                                                        <InputText
                                                            className="w-full md:col-span-2"
                                                            placeholder="Options (comma separated)"
                                                            value={newField.optionsInput}
                                                            onChange={e => setNewField(f => ({
                                                                ...f,
                                                                optionsInput: e.target.value,
                                                                options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                                                            }))}
                                                        />
                                                    )}
                                                    <div className="flex items-center gap-2 md:col-span-2">
                                                        <label>Required</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={newField.required}
                                                            onChange={e => setNewField(f => ({ ...f, required: e.target.checked }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <Button
                                                        label={newField.editIndex !== null ? 'Update Field' : 'Add Field'}
                                                        className="btn btn-primary"
                                                        onClick={handleAddOrEditField}
                                                    />
                                                    {newField.editIndex !== null && (
                                                        <Button
                                                            label="Cancel Edit"
                                                            className="btn btn-outline"
                                                            onClick={() =>
                                                                setNewField({
                                                                    type: '', label: '', placeholder: '', required: false,
                                                                    width: 'full', options: [], optionsInput: '', editIndex: null
                                                                })
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Live Form Preview */}
                                        <div>
                                            <h5 className="mb-2 font-semibold">Live Form Preview</h5>
                                            <form className="p-4 bg-white rounded shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {contactFormFields.length === 0 && (
                                                    <div className="text-gray-400 col-span-2">No fields added yet.</div>
                                                )}
                                                {contactFormFields.map((field, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={
                                                            field.width === 'half' ? 'md:col-span-1'
                                                                : field.width === 'third' ? 'md:col-span-1 lg:col-span-4'
                                                                    : 'col-span-2'
                                                        }
                                                    >
                                                        <label className="block font-medium mb-1">
                                                            {field.label}{field.required && ' *'}
                                                        </label>
                                                        {field.type === 'textarea' ? (
                                                            <InputTextarea className="w-full" placeholder={field.placeholder} autoResize />
                                                        ) : field.type === 'dropdown' ? (
                                                            <Dropdown
                                                                className="w-full"
                                                                placeholder={field.placeholder || 'Select'}
                                                                options={field.options?.map(opt => ({ label: opt, value: opt })) || []}
                                                                optionLabel="label"
                                                                optionValue="value"
                                                                showClear
                                                            />
                                                        ) : field.type === 'checkbox' ? (
                                                            <div className="flex flex-col gap-1">
                                                                {field.options?.map((opt, i) => (
                                                                    <label key={i} className="flex items-center gap-2">
                                                                        <input type="checkbox" />
                                                                        <span>{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <InputText
                                                                className="w-full"
                                                                type={field.type}
                                                                placeholder={field.placeholder}
                                                            />
                                                        )}
                                                        <div className="flex gap-2 mt-1">
                                                            <Button label="Edit" className="btn btn-xs btn-outline" onClick={() => handleEditField(idx)} />
                                                            <Button label="Delete" className="btn btn-xs btn-danger" onClick={() => handleDeleteField(idx)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {section.id === 'blog-section' && (
                                <div className="space-y-6">
                                    {/* Row 1: Blog Title (left), Blog Subtitle (right) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block mb-2">Section Title*</label>
                                            <InputText
                                                className="w-full"
                                                placeholder="Section Title (e.g. BLOG)"
                                                value={formData.blogSectionTitle}
                                                onChange={e => setFormData(prev => ({ ...prev, blogSectionTitle: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Section Subtitle*</label>
                                            <InputTextarea
                                                className="w-full"
                                                placeholder="Section Subtitle (e.g. Real customers reviews)"
                                                value={formData.blogSectionSubtitle}
                                                onChange={e => setFormData(prev => ({ ...prev, blogSectionSubtitle: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    {/* Row 2: Blog Posts label */}
                                    <div>
                                        <label className="block mb-2 font-semibold">Blog Posts*</label>
                                    </div>
                                    {/* Row 3+: Blog Posts */}
                                    {formData.blogPosts.map((post, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-6 bg-white p-4 rounded shadow-sm">
                                            {/* Left: Blog Title, Link, Upload, Date */}
                                            <div className="flex flex-col justify-between h-full gap-4">
                                                <InputText
                                                    className="w-full"
                                                    placeholder="Blog Title"
                                                    value={post.title}
                                                    onChange={e => handleBlogPostChange(idx, 'title', e.target.value)}
                                                />
                                                <InputText
                                                    className="w-full"
                                                    placeholder="Blog Link (e.g. https://...)"
                                                    value={post.link || ''}
                                                    onChange={e => handleBlogPostChange(idx, 'link', e.target.value)}
                                                />
                                                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mt-2">
                                                    {/* Upload Button */}
                                                    <div className="flex flex-col items-start w-[160px] flex-shrink-0">
                                                        <FileUpload
                                                            mode="basic"
                                                            name={`blogImage-${idx}`}
                                                            accept="image/*"
                                                            maxFileSize={1000000}
                                                            chooseLabel="Upload Image"
                                                            onSelect={(e) => {
                                                                const file = e.files[0];
                                                                handleBlogPostChange(idx, 'image', file);
                                                            }}
                                                            auto
                                                            className="p-button-sm whitespace-nowrap"
                                                        />

                                                        <span className="text-secondGray text-xs mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                                                            {typeof post.image === 'object' && post.image?.name
                                                                ? post.image.name
                                                                : typeof post.image === 'string'
                                                                    ? post.image
                                                                    : 'No file chosen'}
                                                        </span>
                                                    </div>

                                                    {/* Calendar Input */}
                                                    <div className="flex-1">
                                                        <Calendar
                                                            value={post.date ? new Date(post.date) : null}
                                                            onChange={(e) =>
                                                                handleBlogPostChange(
                                                                    idx,
                                                                    'date',
                                                                    e.value ? e.value.toISOString().slice(0, 10) : ''
                                                                )
                                                            }
                                                            dateFormat="yy-mm-dd"
                                                            placeholder="Date"
                                                            showIcon
                                                            className="w-full p-inputtext-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Right: Description */}
                                            <div className="flex flex-col h-full">
                                                <InputTextarea
                                                    className="w-full h-full"
                                                    placeholder="Description"
                                                    value={post.description}
                                                    onChange={e => handleBlogPostChange(idx, 'description', e.target.value)}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    {formData.blogPosts.length > 1 && (
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full"
                                                            onClick={() => handleRemoveBlogPost(idx)}
                                                            type="button"
                                                            title="Remove Blog Post"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        label="+Add Blog Post"
                                        className="p-button-link text-secondary mt-2"
                                        onClick={handleAddBlogPost}
                                    />
                                </div>
                            )}

                            {section.id === 'footer-section' && (
                                <div className="space-y-8">
                                    {/* Row 1: About + Copyright */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block mb-2">About*</label>
                                            <InputTextarea
                                                className="w-full"
                                                placeholder="About store"
                                                value={formData.footerAbout}
                                                onChange={e => setFormData(prev => ({ ...prev, footerAbout: e.target.value }))}
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2">Copyright*</label>
                                            <InputText
                                                className="w-full"
                                                placeholder="Copyright text"
                                                value={formData.footerCopyright}
                                                onChange={e => setFormData(prev => ({ ...prev, footerCopyright: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Links + Services */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Links */}
                                        <div>
                                            <label className="block mb-2">Links*</label>
                                            {formData.footerLinks.map((link, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                                    <InputText
                                                        className="min-w-[120px] md:w-40"
                                                        placeholder="Label"
                                                        value={link.label}
                                                        onChange={e => handleFooterListChange('footerLinks', idx, 'label', e.target.value)}
                                                    />
                                                    <InputText
                                                        className="min-w-[150px] flex-1"
                                                        placeholder="URL"
                                                        value={link.url}
                                                        onChange={e => handleFooterListChange('footerLinks', idx, 'url', e.target.value)}
                                                    />
                                                    {formData.footerLinks.length > 1 && (
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full border border-red-300 bg-red-50"
                                                            onClick={() => handleRemoveFooterListItem('footerLinks', idx)}
                                                            type="button"
                                                            title="Remove Link"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minWidth: '2rem',
                                                                minHeight: '2rem',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                label="+Add Link"
                                                className="p-button-link text-secondary mt-2"
                                                onClick={() => handleAddFooterListItem('footerLinks', { label: '', url: '' })}
                                            />
                                        </div>

                                        {/* Services */}
                                        <div>
                                            <label className="block mb-2">Services*</label>
                                            {formData.footerServices.map((service, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                                    <InputText
                                                        className="min-w-[120px] md:w-40"
                                                        placeholder="Label"
                                                        value={service.label}
                                                        onChange={e => handleFooterListChange('footerServices', idx, 'label', e.target.value)}
                                                    />
                                                    <InputText
                                                        className="min-w-[150px] flex-1"
                                                        placeholder="URL"
                                                        value={service.url}
                                                        onChange={e => handleFooterListChange('footerServices', idx, 'url', e.target.value)}
                                                    />
                                                    {formData.footerServices.length > 1 && (
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full border border-red-300 bg-red-50"
                                                            onClick={() => handleRemoveFooterListItem('footerServices', idx)}
                                                            type="button"
                                                            title="Remove Service"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minWidth: '2rem',
                                                                minHeight: '2rem',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                label="+Add Service"
                                                className="p-button-link text-secondary mt-2"
                                                onClick={() => handleAddFooterListItem('footerServices', { label: '', url: '' })}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Socials + Policies */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Socials */}
                                        <div>
                                            <label className="block mb-2">Socials*</label>
                                            {formData.footerSocials.map((social, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                                    <Dropdown
                                                        className="min-w-[120px] md:w-40"
                                                        placeholder="Select Social Platform"
                                                        value={social.icon}
                                                        options={allSocialOptions.filter(
                                                            option =>
                                                                !formData.footerSocials.some((s, i) => s.icon === option.value && i !== idx)
                                                        )}
                                                        onChange={e => handleFooterListChange('footerSocials', idx, 'icon', e.value)}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                    />

                                                    <InputText
                                                        className="min-w-[150px] flex-1"
                                                        placeholder="URL"
                                                        value={social.url}
                                                        onChange={e => handleFooterListChange('footerSocials', idx, 'url', e.target.value)}
                                                    />
                                                    {formData.footerSocials.length > 1 && (
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full border border-red-300 bg-red-50"
                                                            onClick={() => handleRemoveFooterListItem('footerSocials', idx)}
                                                            type="button"
                                                            aria-label="Remove Social"
                                                            title="Remove Social"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minWidth: '2rem',
                                                                minHeight: '2rem',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                label="+Add Social"
                                                className="p-button-link text-secondary mt-2"
                                                onClick={() => handleAddFooterListItem('footerSocials', { icon: '', url: '' })}
                                            />
                                        </div>

                                        {/* Policies */}
                                        <div>
                                            <label className="block mb-2">Policies*</label>
                                            {formData.footerPolicies.map((policy, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                                    <InputText
                                                        className="min-w-[120px] md:w-40"
                                                        placeholder="Label"
                                                        value={policy.label}
                                                        onChange={e => handleFooterListChange('footerPolicies', idx, 'label', e.target.value)}
                                                    />
                                                    <InputText
                                                        className="min-w-[150px] flex-1"
                                                        placeholder="URL"
                                                        value={policy.url}
                                                        onChange={e => handleFooterListChange('footerPolicies', idx, 'url', e.target.value)}
                                                    />
                                                    {formData.footerPolicies.length > 1 && (
                                                        <Button
                                                            className="p-button-text p-button-danger hover:bg-red-100 rounded-full border border-red-300 bg-red-50"
                                                            onClick={() => handleRemoveFooterListItem('footerPolicies', idx)}
                                                            type="button"
                                                            title="Remove Policy"
                                                            style={{
                                                                padding: '0.5rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minWidth: '2rem',
                                                                minHeight: '2rem',
                                                            }}
                                                        >
                                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                label="+Add Policy"
                                                className="p-button-link text-secondary mt-2"
                                                onClick={() => handleAddFooterListItem('footerPolicies', { label: '', url: '' })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </section>
                ))}
            </div>

            {/* Floating Action Bar */}
            <div
                className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-custom flex justify-center items-center py-4 !space-x-3"
                style={{ maxWidth: '100vw' }}
            >
                <Button label="Cancel" className="btn btn-outline" onClick={handleCancel} outlined />
                <Button label="Preview" className="btn btn-secondary" onClick={async () => {
                    // Save latest previewData (already handled by effect, but ensure up-to-date)
                    const formDataWithImages = await convertFormDataImages(formData);
                    const previewData = {
                        formData: { ...formDataWithImages, contactFormFields },
                        selectedSections
                    };
                    localStorage.setItem('previewData', JSON.stringify(previewData));
                    window.open('/store-preview', '_blank');
                }} />
                <Button label="Publish" className="btn btn-primary" onClick={handlePublish} disabled={!!publishedId} />
                {publishedId && (
                    <Button label="View Live Store" className="btn btn-success" onClick={() => window.open(`/store/${publishedId}`, '_blank')} />
                )}
                <Button label="Next" className="btn btn-primary" onClick={handleNext} />
            </div>
        </div>
    );
};

export default WebsiteForm;
