import React from "react";
import { FormData } from "../types/store";
import { HeaderSection } from "../components/store/HeaderSection";
import { HeroSection } from "../components/store/HeroSection";
import { WhatWeDoSection } from "../components/store/WhatWeDoSection";
import { OurTeamSection } from "../components/store/OurTeamSection";
import { HowItWorksSection } from "../components/store/HowItWorksSection";
import { StatisticsSection } from "../components/store/StatisticsSection";
import { TestimonialsSection } from "../components/store/TestimonialsSection";
import { ContactInfoSection } from "../components/store/ContactInfoSection";
import { BlogSection } from "../components/store/BlogSection";
import { FooterSection } from "../components/store/FooterSection";

interface StorePageProps {
    formData: FormData;
    selectedSections: string[];
    previewMode?: boolean;
}

const HEADER_HEIGHT = 80; // match your header's actual height

const StorePage: React.FC<StorePageProps> = ({
    formData,
    selectedSections,
    previewMode,
}) => {
    const hasHero = selectedSections.includes("Hero");
    return (
        <>
            {/* fixed header */}
            {selectedSections.includes("Header") && (
                <HeaderSection
                    storeName={formData.storeName}
                    navigationLinks={formData.navigationLinks}
                    storeLogo={formData.storeLogo}
                    storeLogoSticky={formData.storeLogoSticky}
                    sticky={!previewMode}
                />
            )}

            {/* hero floats underneath transparent header */}
            {hasHero && (
                <HeroSection
                    heroTitle={formData.heroTitle}
                    backgroundImage={formData.backgroundImage}
                    services={Array.isArray(formData.services) ? formData.services : []}
                />
            )}

            {/* everything else gets pushed down by header height */}
            <div
                style={{
                    paddingTop:
                        previewMode || hasHero ? undefined : `${HEADER_HEIGHT}px`,
                }}
            >
                {selectedSections.includes("What We Do") && (
                    <WhatWeDoSection
                        whatWeDo={formData.whatWeDo}
                        aboutUsImage={formData.aboutUsImage}
                    />
                )}
                {selectedSections.includes("Our Team") && (
                    <OurTeamSection
                        ourTeamDescription={formData.ourTeamDescription}
                        ourTeamCTA={formData.ourTeamCTA}
                        ourTeamCTALink={formData.ourTeamCTALink}
                        teamMembers={formData.teamMembers}
                    />
                )}
                {selectedSections.includes("How It Works") && (
                    <HowItWorksSection
                        title={formData.howItWorksTitle}
                        subtitle={formData.howItWorksSubtitle}
                        steps={formData.howItWorksSteps}
                    />
                )}
                {selectedSections.includes("Statistics") && (
                    <StatisticsSection stats={formData.statisticsStats} />
                )}
                {selectedSections.includes("Testimonials") && (
                    <TestimonialsSection
                        testimonials={formData.testimonialsList}
                        title={formData.testimonialsSectionTitle}
                        description={formData.testimonialsSectionDescription}
                    />
                )}
                {selectedSections.includes("Contact Info") && (
                    <ContactInfoSection
                        title={formData.contactInfoTitle}
                        description={formData.contactInfoDescription}
                        methods={formData.contactMethods}
                        formSubmitLabel={formData.contactFormSubmitLabel}
                        contactFormFields={formData.contactFormFields}
                    />
                )}
                {selectedSections.includes("Blog Section") && (
                    <BlogSection
                        title={formData.blogSectionTitle}
                        subtitle={formData.blogSectionSubtitle}
                        posts={formData.blogPosts}
                    />
                )}
                {selectedSections.includes("Footer Section") && (
                    <FooterSection
                        storeName={formData.storeName}
                        about={formData.footerAbout}
                        links={formData.footerLinks}
                        services={formData.footerServices}
                        socials={formData.footerSocials}
                        copyright={formData.footerCopyright}
                        policies={formData.footerPolicies}
                    />
                )}
            </div>
        </>
    );
};

export default StorePage;
