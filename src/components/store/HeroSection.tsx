import { ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSection = ({
    heroTitle,
    backgroundImage,
    services
}: {
    heroTitle: string;
    backgroundImage: File | string | null;
    services: { name: string; link: string; icon: File | string | null }[];
}) => {
    const isCarousel = services.length > 4;
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);
    const isBeginning = activeIndex === 0;
    const isEnd = services.length > 0 && activeIndex === services.length - (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);

    return (
        <section
            className="bg-cover bg-center text-white text-center flex flex-col justify-center px-4 pt-36 pb-16 min-h-[80vh] overflow-x-hidden"
            style={{
                backgroundImage: backgroundImage
                    ? `url(${typeof backgroundImage === 'string' ? backgroundImage : URL.createObjectURL(backgroundImage)})`
                    : undefined
            }}
        >
            <div className="max-w-7xl mx-auto w-full">
                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 max-w-3xl mx-auto leading-tight">
                    {heroTitle || "Revolutionizing Repairs and Service Efficiency with Smart Solutions."}
                </h1>

                {isCarousel ? (
                    <div className="relative w-full overflow-x-hidden">
                        {/* Custom Arrows */}
                        <button
                            ref={prevRef}
                            className={`absolute left-[0px] top-1/2 -translate-y-1/2 z-10 bg-white text-[#223046] shadow-lg rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 transition-all ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                            aria-label="Previous"
                            onClick={() => {
                                if (!isBeginning && swiperRef.current) swiperRef.current.slidePrev();
                            }}
                            disabled={isBeginning}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            ref={nextRef}
                            className={`absolute right-[0px] top-1/2 -translate-y-1/2 z-10 bg-white text-[#223046] shadow-lg rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 transition-all ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                            aria-label="Next"
                            onClick={() => {
                                if (!isEnd && swiperRef.current) swiperRef.current.slideNext();
                            }}
                            disabled={isEnd}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <div className="max-w-6xl mx-auto">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={24}
                                slidesPerView={1}
                                centeredSlides={true}
                                breakpoints={{
                                    640: { slidesPerView: 2, centeredSlides: false },
                                    1024: { slidesPerView: 3, centeredSlides: false },
                                    1280: { slidesPerView: 4, centeredSlides: false }, // Remove 4 for desktop, keep 3
                                }}
                                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                                onInit={swiper => {
                                    swiperRef.current = swiper;
                                    // @ts-ignore
                                    swiper.params.navigation.prevEl = prevRef.current;
                                    // @ts-ignore
                                    swiper.params.navigation.nextEl = nextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }}
                                pagination={{ clickable: true, el: '.hero-swiper-pagination' }}
                                className="mt-8 px-2 w-full"
                                style={{ overflow: 'visible' }}
                                onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                            >
                                {services.map((service, idx) => (
                                    <SwiperSlide
                                        key={idx}
                                        className="flex justify-center items-center"
                                    >
                                        <a
                                            href={service.link || "#"}
                                            className="
                                                group bg-[#2c3e50] text-white px-6 py-8 rounded-lg
                                                w-full max-w-xs sm:max-w-xs md:max-w-sm
                                                mx-auto flex flex-col items-center text-center
                                            "
                                            style={{ width: '100%', maxWidth: '20rem' }} // fallback for max-w-xs
                                        >
                                            {service.icon && (
                                                typeof service.icon === 'string'
                                                    ? <img src={service.icon} alt="icon" className="w-16 h-16 mb-4" />
                                                    : <img src={URL.createObjectURL(service.icon)} alt="icon" className="w-12 h-12 mb-4" />
                                            )}
                                            <div className="flex items-center justify-center gap-2">
                                                <h4 className="text-lg font-semibold">{service.name}</h4>
                                                <ArrowUpRight
                                                    size={18}
                                                    className="text-green-400 transition-transform duration-300 group-hover:-translate-y-1"
                                                />
                                            </div>
                                        </a>
                                    </SwiperSlide>

                                ))}
                            </Swiper>
                        </div>
                        {/* Custom Pagination Dots */}
                        <div className="hero-swiper-pagination flex justify-center gap-3 mt-8 mb-2" style={{ position: 'static' }}></div>
                        <style>{`
                            .hero-swiper-pagination .swiper-pagination-bullet {
                                background: #fff;
                                opacity: 0.7;
                                width: 14px;
                                height: 14px;
                                margin: 0 6px !important;
                                transition: opacity 0.2s;
                            }
                            .hero-swiper-pagination .swiper-pagination-bullet-active {
                                opacity: 1;
                                background: #fff;
                            }
                            
                        `}</style>
                    </div>
                ) : (
                    <div className="mt-8 flex flex-wrap justify-center gap-6">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                className={`bg-[#2c3e50] text-white px-6 py-8 rounded-lg flex flex-col items-center shrink-0 ${services.length <= 2 ? 'w-1/3 max-w-xs' : 'flex-1 max-w-sm'}`}
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
                )}
            </div>
        </section>
    );
};
