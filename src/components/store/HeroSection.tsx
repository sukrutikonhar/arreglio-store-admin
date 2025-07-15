import { ArrowUpRight } from 'lucide-react';

export const HeroSection = ({
    heroTitle,
    backgroundImage,
    services
}: {
    heroTitle: string;
    backgroundImage: File | string | null;
    services: { name: string; link: string; icon: File | string | null }[];
}) => (
    <section
        className="bg-cover bg-center text-white text-center flex flex-col justify-center px-4 pt-36 pb-16 min-h-[80vh]"
        style={{
            backgroundImage: backgroundImage
                ? `url(${typeof backgroundImage === 'string' ? backgroundImage : URL.createObjectURL(backgroundImage)})`
                : undefined
        }}
    >
        <h1 className="text-4xl sm:text-5xl font-semibold mb-6 max-w-3xl mx-auto leading-tight">
            {heroTitle || "Revolutionizing Repairs and Service Efficiency with Smart Solutions."}
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
            {services && services.map((service, idx) => (
                <div
                    key={idx}
                    className="bg-[#2c3e50] text-white px-6 py-8 rounded-lg min-w-[150px] flex flex-col items-center"
                >
                    {service.icon && (
                        typeof service.icon === 'string'
                            ? <img src={service.icon} alt="icon" className="w-8 h-8 mb-2" />
                            : <img src={URL.createObjectURL(service.icon)} alt="icon" className="w-8 h-8 mb-2" />
                    )}
                    <div>{service.name}</div>
                    <a href={service.link || "#"} className="text-green-400 mt-3">
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            ))}
        </div>
    </section>
);
