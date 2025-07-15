export const StatisticsSection = ({ stats }: { stats: { value: string; suffix: string; title: string }[] }) => (
    <section className="bg-[#34495e] px-4 py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-16">
            {stats && stats.map((stat, idx) => (
                <div key={idx} className="text-center text-white min-w-0 w-full md:w-48 max-w-xs mx-auto md:mx-0">
                    <div className="font-bold text-3xl md:text-4xl mb-2">{stat.value}{stat.suffix}</div>
                    <div className="font-medium text-base md:text-lg tracking-wide">{stat.title}</div>
                </div>
            ))}
        </div>
    </section>
); 