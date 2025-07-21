import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

export const ContactInfoSection = ({
    title,
    description,
    methods,
    formSubmitLabel,
    contactFormFields = [],
}: {
    title: string;
    description: string;
    methods: { icon: string; label: string; value: string }[];
    formSubmitLabel: string;
    contactFormFields?: Array<{
        type: string;
        label: string;
        placeholder?: string;
        required?: boolean;
        width?: 'full' | 'half' | 'third';
        options?: string[];
    }>;
}) => (
    <section className="bg-[#f5f5f5] px-4 md:px-12 py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 max-w-7xl mx-auto">
            {/* Left: Info */}
            <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
                <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title || 'HOW TO FIND US'}</h2>
                <div className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">{description || 'Get in touch with us for any inquiries or support.'}</div>
                {/* Contact Methods */}
                <div className="flex flex-col gap-6">
                    {methods && methods.length > 0 ? methods.map((method, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="bg-[#2ECC71] w-14 h-14 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-2xl">
                                    {method.icon === 'phone' ? <HiOutlinePhone size={28} /> :
                                        method.icon === 'mail' ? <HiOutlineEnvelope size={28} /> :
                                            method.icon === 'location' ? <HiOutlineMapPin size={28} /> :
                                                method.icon === 'clock' ? '🕒' :
                                                    method.icon || '📋'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-lg text-[#707070] mb-1">{method.label || `Contact Method ${idx + 1}`}</div>
                                <div className="text-gray-500 text-sm">
                                    {method.icon === 'phone' && method.value ? (
                                        <a href={`tel:${method.value}`} className="text-gray-500">{method.value}</a>
                                    ) : method.icon === 'mail' && method.value ? (
                                        <a href={`mailto:${method.value}`} className="text-gray-500">{method.value}</a>
                                    ) : (
                                        method.value || 'Contact information'
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-sm">No contact methods available</div>
                    )}
                </div>
            </div>
            {/* Right: Form */}
            <div className="flex-1 min-w-[260px]">
                {/* Contact Form */}
                <form className="bg-[#95A5A6] p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-4">
                    {/* <h4 className="text-xl font-semibold text-[#223046] mb-6 text-center">Send us a message</h4> */}
                    <div className="flex flex-wrap gap-4">
                        {contactFormFields && contactFormFields.length > 0 ? contactFormFields.map((field, idx) => {
                            const width = field.width === 'half' ? 'md:w-[48%] w-full' : field.width === 'third' ? 'md:w-[32%] w-full' : 'w-full';
                            if (field.type === 'dropdown') {
                                return (
                                    <div key={idx} className={width}>
                                        <label className="block text-[#223046] font-medium mb-1">{field.label}{field.required && ' *'}</label>
                                        <Dropdown
                                            className="w-full"
                                            placeholder={field.placeholder || 'Select an option'}
                                            options={field.options?.map(opt => ({ label: opt, value: opt })) || []}
                                            optionLabel="label"
                                            optionValue="value"
                                            required={field.required}
                                            showClear={!field.required}
                                            value={undefined}
                                            onChange={() => { }}
                                        />
                                    </div>
                                );
                            } else if (field.type === 'checkbox') {
                                return (
                                    <div key={idx} className={width}>
                                        <label className="block text-[#223046] font-medium mb-1">{field.label}{field.required && ' *'}</label>
                                        <div className="flex flex-col gap-1">
                                            {field.options && field.options.map((opt, i) => (
                                                <label key={i} className="flex items-center gap-2">
                                                    <Checkbox inputId={`cb-${idx}-${i}`} checked={false} onChange={() => { }} />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            } else if (field.type === 'textarea') {
                                return (
                                    <div key={idx} className={width}>
                                        <label className="block text-[#223046] font-medium mb-1">{field.label}{field.required && ' *'}</label>
                                        <InputTextarea
                                            className="w-full"
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            autoResize
                                            value={''}
                                            onChange={() => { }}
                                        />
                                    </div>
                                );
                            } else {
                                // text, email, tel, url, number, date, etc.
                                return (
                                    <div key={idx} className={width}>
                                        <label className="block text-[#223046] font-medium mb-1">{field.label}{field.required && ' *'}</label>
                                        <InputText
                                            className="w-full"
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            value={''}
                                            onChange={() => { }}
                                        />
                                    </div>
                                );
                            }
                        }) : (
                            <div className="text-gray-400 text-center w-full">No form fields configured.</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-[#1FC47C] text-white py-3 px-6 rounded-md font-semibold text-base w-full mt-6 hover:bg-[#18a06b] transition-colors duration-200"
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#18a06b'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1FC47C'}
                    >
                        {formSubmitLabel || 'Send Query'}
                    </button>
                </form>
            </div>
        </div>
    </section>
); 