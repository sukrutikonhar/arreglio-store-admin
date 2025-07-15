import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
    FaPinterestP,
    FaWhatsapp,
    FaTelegramPlane,
    FaSnapchatGhost,
    FaRedditAlien,
    FaGlobe
} from 'react-icons/fa';

export const FooterSection = ({
    storeName,
    about,
    links,
    services,
    socials,
    copyright,
    policies
}: {
    storeName: string;
    about: string;
    links: { label: string; url: string }[];
    services: { label: string; url: string }[];
    socials: { icon: string; url: string }[];
    copyright: string;
    policies: { label: string; url: string }[];
}) => (
    <footer className="bg-[#223046] text-white px-4 pt-12 pb-4">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 max-w-6xl mx-auto flex-wrap">
            {/* About */}
            <div className="flex-1 min-w-[180px] mb-8 md:mb-0">
                <h4 className="font-bold text-xl mb-2">{storeName || "Store name"}</h4>
                <div className="text-[#cfd8dc] text-sm leading-relaxed">{about || "About your store description"}</div>
            </div>
            {/* Links */}
            <div className="flex-1 min-w-[120px] mb-8 md:mb-0">
                <div className="font-bold mb-3 text-base">Links</div>
                {links && links.length > 0 ? links.map((link, idx) => (
                    <div key={idx} className="text-[#cfd8dc] text-sm mb-1">
                        <a href={link.url} className="hover:text-white transition-colors duration-200" style={{ textDecoration: 'none' }}>{link.label || `Link ${idx + 1}`}</a>
                    </div>
                )) : (
                    <div className="text-[#cfd8dc] text-sm">No links available</div>
                )}
            </div>
            {/* Services */}
            <div className="flex-1 min-w-[120px] mb-8 md:mb-0">
                <div className="font-bold mb-3 text-base">Services</div>
                {services && services.length > 0 ? services.map((service, idx) => (
                    <div key={idx} className="text-[#cfd8dc] text-sm mb-1">
                        <a href={service.url} className="hover:text-white transition-colors duration-200" style={{ textDecoration: 'none' }}>{service.label || `Service ${idx + 1}`}</a>
                    </div>
                )) : (
                    <div className="text-[#cfd8dc] text-sm">No services available</div>
                )}
            </div>
            {/* Socials */}
            <div className="flex-1 min-w-[120px] mb-8 md:mb-0">
                <div className="font-bold mb-3 text-base">Socials</div>
                <div className="flex gap-3 flex-wrap">
                    {socials && socials.length > 0 ? socials.map((social, idx) => (
                        <a key={idx} href={social.url} className="text-white text-xl hover:scale-110 transition-transform duration-200 flex items-center" style={{ textDecoration: 'none' }}>
                            {social.icon === 'facebook' ? <FaFacebookF size={20} />
                                : social.icon === 'instagram' ? <FaInstagram size={20} />
                                    : social.icon === 'linkedin' ? <FaLinkedinIn size={20} />
                                        : social.icon === 'twitter' ? <FaTwitter size={20} />
                                            : social.icon === 'youtube' ? <FaYoutube size={20} />
                                                : social.icon === 'tiktok' ? <FaTiktok size={20} />
                                                    : social.icon === 'pinterest' ? <FaPinterestP size={20} />
                                                        : social.icon === 'whatsapp' ? <FaWhatsapp size={20} />
                                                            : social.icon === 'telegram' ? <FaTelegramPlane size={20} />
                                                                : social.icon === 'snapchat' ? <FaSnapchatGhost size={20} />
                                                                    : social.icon === 'reddit' ? <FaRedditAlien size={20} />
                                                                        : <FaGlobe size={20} />
                            }
                        </a>
                    )) : (
                        <div className="text-[#cfd8dc] text-sm">No social links</div>
                    )}
                </div>
            </div>
        </div>
        <div className="border-t border-[#cfd8dc33] my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-2 md:gap-0">
            <div className="text-[#cfd8dc] text-xs">{copyright || '© 2024 All rights reserved.'}</div>
            <div className="text-[#cfd8dc] text-xs flex flex-wrap gap-2 md:gap-4">
                {policies && policies.length > 0 ? policies.map((policy, idx) => (
                    <span key={idx}>
                        <a href={policy.url} className="underline hover:text-white transition-colors duration-200 ml-0 md:ml-3" style={{ textDecoration: 'underline' }}>{policy.label || `Policy ${idx + 1}`}</a>
                        {idx < policies.length - 1 && <span className="hidden md:inline">-</span>}
                    </span>
                )) : (
                    <span>Privacy Policy - Terms & Conditions</span>
                )}
            </div>
        </div>
    </footer>
); 