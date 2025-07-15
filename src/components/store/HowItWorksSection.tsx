export const HowItWorksSection = ({
    title,
    subtitle,
    steps
}: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
}) => (
    <section className="px-4 py-10 md:py-16 text-center">
        <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title || 'HOW IT WORKS'}</h2>
        <div className="text-gray-500 text-lg md:text-xl mb-8">{subtitle || 'seamless service'}</div>
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            {steps && steps.map((step, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md px-6 py-8 min-w-0 w-full md:w-72 max-w-xs mx-auto md:mx-0 text-left flex flex-col items-start">
                    <div className="text-[#1FC47C] font-semibold text-sm mb-2">STEP</div>
                    <div className="font-bold text-2xl md:text-3xl text-[#223046] mb-2">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="text-gray-700 text-base">{step.description}</div>
                </div>
            ))}
        </div>
    </section>
); 