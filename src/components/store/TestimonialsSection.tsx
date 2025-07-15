export const TestimonialsSection = ({
    testimonials,
    title = "WHAT PEOPLE SAY",
    description = "Real customers reviews"
}: {
    testimonials: { rating: number; testimonial: string; name: string; designation: string; company: string }[];
    title?: string;
    description?: string;
}) => {
    // For simplicity, render all testimonials in a row (carousel logic can be added later)
    return (
        <section className="px-4 py-10 md:py-16 text-center">
            <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title}</h2>
            <div className="text-gray-500 text-lg md:text-xl mb-8">{description}</div>
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
                {testimonials && testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md px-6 py-8 min-w-0 w-full md:w-96 max-w-md mx-auto md:mx-0 text-center flex flex-col items-center">
                        <div className="text-yellow-400 text-2xl mb-2">
                            {'\u2605'.repeat(t.rating)}{'\u2606'.repeat(5 - t.rating)}
                        </div>
                        <div className="text-gray-700 text-base mb-4 min-h-[80px]">{t.testimonial}</div>
                        <div className="font-bold text-lg text-[#223046] mb-1">{t.name}</div>
                        <div className="text-gray-500 text-sm">{t.designation}{t.company ? `, ${t.company}` : ''}</div>
                    </div>
                ))}
            </div>
            {/* Carousel dots (static for now) */}
            <div className="mt-6 flex justify-center gap-2">
                {testimonials && testimonials.map((_, idx) => (
                    <span key={idx} className="w-3 h-3 rounded-full bg-[#1FC47C] opacity-30 inline-block" />
                ))}
            </div>
        </section>
    );
}; 