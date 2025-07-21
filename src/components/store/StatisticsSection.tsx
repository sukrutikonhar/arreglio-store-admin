import { useEffect, useRef, useState } from 'react';

export const StatisticsSection = ({ stats }: { stats: { value: string; suffix: string; title: string }[] }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [counts, setCounts] = useState(stats.map(() => 0));

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const intervals: number[] = [];
        stats.forEach((stat, idx) => {
            const target = parseInt(stat.value.replace(/\D/g, ''));
            const duration = 1200;
            const step = Math.max(1, Math.floor(target / (duration / 16)));
            let current = 0;
            intervals[idx] = window.setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(intervals[idx]);
                }
                setCounts(prev => {
                    const next = [...prev];
                    next[idx] = current;
                    return next;
                });
            }, 16);
        });
        return () => intervals.forEach(clearInterval);
    }, [visible, stats]);

    return (
        <section className="bg-[#34495e] px-4 py-10 md:py-16">
            <div ref={sectionRef} className="flex flex-col md:flex-row justify-center gap-6 md:gap-16">
                {stats && stats.map((stat, idx) => (
                    <div key={idx} className="text-center text-white min-w-0 w-full md:w-48 max-w-xs mx-auto md:mx-0">
                        <div className="font-bold text-3xl md:text-4xl mb-2">
                            {counts[idx].toLocaleString()}{stat.suffix}
                        </div>
                        <div className="font-medium text-base md:text-lg tracking-wide">{stat.title}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}; 