import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Tag } from 'lucide-react';

export const BlogSection = ({
    title,
    subtitle,
    posts
}: {
    title: string;
    subtitle: string;
    posts: { image: File | string | null; date: string; comment: string; title: string; description: string }[];
}) => {
    const isCarousel = posts && posts.length > 3;
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);
    const isBeginning = activeIndex === 0;
    const isEnd = posts.length > 0 && activeIndex === posts.length - (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);

    return (
        <section className="px-4 py-10 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto mb-12">
                    <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title}</h2>
                    <div className="text-center text-gray-500 text-lg md:text-xl mb-8">{subtitle}</div>
                </div>
                {isCarousel ? (
                    <div className="px-0 md:px-8 relative w-full overflow-x-hidden">
                        {/* Custom Arrows */}
                        <button
                            ref={prevRef}
                            className={`blog-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-600 w-8 h-8 text-white rounded-full flex items-center justify-center border border-[#707070] transition-all ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
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
                            className={`blog-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-600 w-8 h-8 text-white rounded-full flex items-center justify-center border border-[#707070] transition-all ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
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
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
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
                            pagination={{ clickable: true, el: '.blog-swiper-pagination' }}
                            className="blog-carousel"
                            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                        >
                            {posts.map((post, idx) => (
                                <SwiperSlide key={idx} className="p-4 text-left">
                                    <div className="overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={
                                                    typeof post.image === 'string'
                                                        ? post.image
                                                        : post.image
                                                            ? URL.createObjectURL(post.image)
                                                            : undefined
                                                }
                                                alt={post.title}
                                                className="w-full h-48 object-cover rounded-[8px] border border-[#707070]"
                                            />
                                            <span className="absolute bottom-0 left-3 bg-secondary text-white text-sm px-3 py-1 border border-[#707070] opacity-90 rounded-md">
                                                {post.date}
                                            </span>
                                        </div>
                                        <div className="py-4">
                                            <div className="flex items-center gap-8 mt-2 text-text text-sm">
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <MessageSquare className="w-4 h-4 text-secondary" />
                                                    Comment
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <Tag className="w-4 h-4 text-secondary" />
                                                    Development
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-left mt-2">{post.title}</h4>
                                            <p className="text-[15px] mt-2 leading-[1.4]">{post.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {/* Custom Pagination Dots */}
                        <div className="blog-swiper-pagination flex justify-center gap-3 mt-8 mb-2" style={{ position: 'static' }}></div>
                        <style>{`
                            .blog-swiper-pagination .swiper-pagination-bullet {
                                background: #1FC47C;
                                opacity: 0.7;
                                width: 14px;
                                height: 14px;
                                margin: 0 6px !important;
                                transition: opacity 0.2s;
                            }
                            .blog-swiper-pagination .swiper-pagination-bullet-active {
                                opacity: 1;
                                background: #1FC47C;
                            }
                        `}</style>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
                        {posts.map((post, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-md w-full md:w-80 max-w-xs mx-auto md:mx-0 overflow-hidden flex flex-col">
                                {post.image && (
                                    <img
                                        src={typeof post.image === 'string' ? post.image : URL.createObjectURL(post.image)}
                                        alt={post.title}
                                        className="w-full h-44 object-cover"
                                    />
                                )}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="text-[#1FC47C] font-semibold text-sm mb-2">{post.date}</div>
                                    <div className="text-gray-400 text-xs mb-1">{post.comment}</div>
                                    <div className="font-bold text-lg text-[#223046] mb-2">{post.title}</div>
                                    <div className="text-gray-500 text-sm">{post.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};