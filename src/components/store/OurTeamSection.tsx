import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaPinterest, FaWhatsapp, FaTelegram, FaSnapchat, FaReddit, FaGlobe } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <FaFacebook />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    youtube: <FaYoutube />,
    tiktok: <FaTiktok />,
    pinterest: <FaPinterest />,
    whatsapp: <FaWhatsapp />,
    telegram: <FaTelegram />,
    snapchat: <FaSnapchat />,
    reddit: <FaReddit />,
    other: <FaGlobe />
};

export const OurTeamSection = ({ ourTeamDescription, ourTeamCTA, ourTeamCTALink, teamMembers }: {
    ourTeamDescription: string;
    ourTeamCTA: string;
    ourTeamCTALink: string;
    teamMembers: { profilePicture: File | string | null; name: string; designation: string; socials?: { icon: string; url: string }[] }[];
}) => {
    const isCarousel = teamMembers && teamMembers.length > 3;


    return (
        <section className="bg-[#f5f5f5] px-4 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                {/* Left: Description and CTA */}
                <div className="md:col-span-4 min-w-[220px] mb-6 md:mb-0">
                    <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">OUR TEAM</h2>
                    <p className="text-[#707070] text-base md:text-lg mb-6">{ourTeamDescription || 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t.'}</p>
                    {ourTeamCTA && (
                        <a href={ourTeamCTALink || '#'} className="inline-block bg-[#1FC47C] text-white px-8 py-3 rounded-md font-medium text-base md:text-lg mt-2 hover:bg-[#18a06b] transition-colors duration-200">
                            {ourTeamCTA}
                        </a>
                    )}
                </div>
                {/* Right: Team Members Grid or Carousel */}
                <div className="md:col-span-8 overflow-x-hidden">
                    {isCarousel ? (
                        <div className="w-full">
                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={16}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                                pagination={{ clickable: true, el: '.team-swiper-pagination' }}
                                className="team-carousel"
                            >
                                {teamMembers.map((member, idx) => (
                                    <SwiperSlide key={idx} className="flex justify-center items-stretch">
                                        <div className="bg-white p-0 text-center overflow-hidden flex flex-col h-full w-full max-w-xs mx-auto">
                                            {member.profilePicture && (
                                                typeof member.profilePicture === 'string'
                                                    ? <img src={member.profilePicture} alt={member.name} className="w-full h-44 object-cover" />
                                                    : <img src={URL.createObjectURL(member.profilePicture)} alt={member.name} className="w-full h-44 object-cover" />
                                            )}
                                            <div className="py-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="font-semibold text-lg text-[#223046]">{member.name || 'Team Member'}</div>
                                                    <div className="text-gray-500 text-sm mb-2">{member.designation || 'Designation'}</div>
                                                </div>
                                                {/* Socials */}
                                                {member.socials && member.socials.length > 0 && (
                                                    <div className="mt-3 flex justify-center gap-4">
                                                        {member.socials.map((social, sIdx) => (
                                                            social.url ? (
                                                                <a key={sIdx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-[#1FC47C] text-xl hover:text-[#18a06b] transition-colors duration-200" title={social.icon}>
                                                                    {socialIconMap[social.icon] || <FaGlobe />}
                                                                </a>
                                                            ) : null
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* Custom Pagination Dots */}
                            <div className="team-swiper-pagination flex justify-center gap-3 mt-8 mb-2" style={{ position: 'static' }}></div>
                            <style>{`
                                .team-swiper-pagination .swiper-pagination-bullet {
                                    background: #1FC47C;
                                    opacity: 0.7;
                                    width: 14px;
                                    height: 14px;
                                    margin: 0 6px !important;
                                    transition: opacity 0.2s;
                                }
                                .team-swiper-pagination .swiper-pagination-bullet-active {
                                    opacity: 1;
                                    background: #1FC47C;
                                }
                            `}</style>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamMembers && teamMembers.map((member, idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-sm p-0 text-center overflow-hidden flex flex-col h-full">
                                    {member.profilePicture && (
                                        typeof member.profilePicture === 'string'
                                            ? <img src={member.profilePicture} alt={member.name} className="w-full h-44 object-cover" />
                                            : <img src={URL.createObjectURL(member.profilePicture)} alt={member.name} className="w-full h-44 object-cover" />
                                    )}
                                    <div className="py-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="font-bold text-lg text-[#223046]">{member.name || 'Team Member'}</div>
                                            <div className="text-gray-500 text-sm mb-2">{member.designation || 'Designation'}</div>
                                        </div>
                                        {/* Socials */}
                                        {member.socials && member.socials.length > 0 && (
                                            <div className="mt-3 flex justify-center gap-4">
                                                {member.socials.map((social, sIdx) => (
                                                    social.url ? (
                                                        <a key={sIdx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-[#1FC47C] text-xl hover:text-[#18a06b] transition-colors duration-200" title={social.icon}>
                                                            {socialIconMap[social.icon] || <FaGlobe />}
                                                        </a>
                                                    ) : null
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};