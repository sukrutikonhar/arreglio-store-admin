import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection = ({
    testimonials,
    title = "WHAT PEOPLE SAY",
    description = "Real customers reviews"
}: {
    testimonials: { rating: number; testimonial: string; name: string; designation: string; company: string }[];
    title?: string;
    description?: string;
}) => {
    const isCarousel = testimonials && testimonials.length > 3;
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);
    const isBeginning = activeIndex === 0;
    const isEnd = testimonials.length > 0 && activeIndex === testimonials.length - (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);

    return (
        <section className="px-4 py-10 md:py-16 text-center">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto mb-12">
                    <h2 className="font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title || 'WHAT PEOPLE SAY'}</h2>
                    <div className="text-gray-500 text-lg md:text-xl mb-8">{description}</div>
                </div>
                {isCarousel ? (
                    <div className="px-0 md:px-8 relative w-full overflow-x-hidden">
                        {/* Custom Arrows */}
                        <button
                            ref={prevRef}
                            className={`testimonials-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-600 w-8 h-8 text-white rounded-full flex items-center justify-center border border-[#707070] transition-all ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                            aria-label="Previous"
                            onClick={() => {
                                if (!isBeginning && swiperRef.current) swiperRef.current.slidePrev();
                            }}
                            disabled={isBeginning}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            ref={nextRef}
                            className={`testimonials-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-600 w-8 h-8 text-white rounded-full flex items-center justify-center border border-[#707070] transition-all ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                            aria-label="Next"
                            onClick={() => {
                                if (!isEnd && swiperRef.current) swiperRef.current.slideNext();
                            }}
                            disabled={isEnd}
                        >
                            <ChevronRight size={20} />
                        </button>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
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
                            pagination={{ clickable: true, el: '.testimonials-swiper-pagination' }}
                            className="testimonials-carousel"
                            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                        >
                            {testimonials.map((t, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="bg-white shadow-custom px-6 py-8 min-w-0 w-full md:w-96 max-w-md mx-auto md:mx-0 text-center flex flex-col items-center">
                                        <div className="text-yellow-400 text-2xl mb-2">
                                            {'\u2605'.repeat(t.rating)}{'\u2606'.repeat(5 - t.rating)}
                                        </div>
                                        <div className="text-gray-700 text-base mb-4 min-h-[80px]">{t.testimonial}</div>
                                        <div className="font-bold text-lg text-[#223046] mb-1">{t.name}</div>
                                        <div className="text-gray-500 text-sm">{t.designation}{t.company ? `, ${t.company}` : ''}</div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {/* Custom Pagination Dots */}
                        <div className="testimonials-swiper-pagination flex justify-center gap-3 mt-8 mb-2" style={{ position: 'static' }}></div>
                        <style>{`
                            .testimonials-swiper-pagination .swiper-pagination-bullet {
                                background: #1FC47C;
                                opacity: 0.7;
                                width: 14px;
                                height: 14px;
                                margin: 0 6px !important;
                                transition: opacity 0.2s;
                            }
                            .testimonials-swiper-pagination .swiper-pagination-bullet-active {
                                opacity: 1;
                                background: #1FC47C;
                            }
                        `}</style>
                    </div>
                ) : (
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
                )}
            </div>
        </section>
    );
}; 