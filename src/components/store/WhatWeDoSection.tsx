export const WhatWeDoSection = ({ whatWeDo, aboutUsImage }: { whatWeDo: string; aboutUsImage: File | string | null }) => (
    <section className="flex flex-col md:flex-row items-center px-4 py-10 md:py-16 gap-8 md:gap-12">
        {/* Left: Image */}
        <div className="flex-1 flex justify-center mb-6 md:mb-0">
            {aboutUsImage && (
                <img src={typeof aboutUsImage === 'string' ? aboutUsImage : URL.createObjectURL(aboutUsImage)} alt="About us" className="w-full max-w-xs md:max-w-md rounded-lg shadow-md object-cover" />
            )}
        </div>
        {/* Right: Text */}
        <div className="flex-2 min-w-0">
            <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">WHAT WE DO</h2>
            <p className="text-gray-700 text-base md:text-lg mb-4">{whatWeDo || "Arreglio combines cutting-edge AI with seamless service management tools to transform how workshops operate and how customers approach repairs."}</p>
            <div className="flex items-center mb-4">
                <div className="w-1 h-12 bg-[#1FC47C] rounded mr-4" />
                <span className="font-bold text-lg md:text-2xl text-[#223046] leading-snug">
                    10+ Years Of Working Experience In Quality Repair Services.
                </span>
            </div>
            <p className="text-gray-500 text-sm md:text-base">
                Arreglio combines cutting-edge AI with seamless service management tools to transform how workshops
            </p>
        </div>
    </section>
); 