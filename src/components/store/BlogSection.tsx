export const BlogSection = ({
    title,
    subtitle,
    posts
}: {
    title: string;
    subtitle: string;
    posts: { image: File | string | null; date: string; comment: string; title: string; description: string }[];
}) => (
    <section className="px-4 py-10 md:py-16 bg-white">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-[#223046] tracking-tight">{title}</h2>
        <div className="text-center text-gray-500 text-lg md:text-xl mb-8">{subtitle}</div>
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
    </section>
); 