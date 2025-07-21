export const HowItWorksSection = ({
    title,
    subtitle,
    steps
}: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
}) => (
    <section className="px-4 md:px-12 max-w-7xl mx-auto py-10 md:py-16 text-center">
        <div>
            <div className="max-w-2xl mx-auto mb-12">
                <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">
                    {title || 'HOW IT WORKS'}
                </h2>
                <div className="text-gray-500 text-lg md:text-xl">
                    {subtitle || 'seamless service'}
                </div>
            </div>

            {/* Grid: 3 items per row, centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {steps && steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-custom px-6 py-8 min-w-0 w-full max-w-sm mx-auto md:mx-0 text-left flex items-center"
                    >
                        {/* Left Side: STEP + Number */}
                        <div className="flex flex-col items-start flex-shrink-0 mr-4">
                            <div className="text-[#FFAA17] font-normal text-sm mb-1">
                                STEP
                            </div>
                            <div className="font-normal text-2xl md:text-3xl text-[#223046]">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Right Side: Title + Description */}
                        <div className="flex-1">
                            <p className="text-[#707070] text-md">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </section>
);
