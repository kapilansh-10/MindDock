export function ContentCard({ item }: any) {
  const icons: any = {
    youtube: "🎬",
    tweet: "🧵",
    document: "📄",
    link: "🔗",
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6">
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl mr-2 drop-shadow">{icons[item.type]}</span>
        <h2 className="text-xl font-semibold">{item.title}</h2>
      </div>

      <p className="text-sm text-gray-400">{item.type}</p>

      <a
        href={item.link}
        target="_blank"
        className="text-blue-400 underline mt-2 inline-block"
      >
        Open Link
      </a>

      <div className="flex gap-2 mt-4 flex-wrap">
        {item.tags?.map((tag: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 border border-white/10 text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
