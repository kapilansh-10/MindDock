"use client";

export function ContentCard({ item, onDelete }: any) {
  return (
    <div className="bg-neutral-900 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{item.title}</h2>
      <p className="text-sm text-gray-400">{item.type}</p>

      <a 
        href={item.link} 
        target="_blank" 
        className="text-blue-400 underline"
      >
        Open Link
      </a>

      {/* Tags */}
      <div className="flex gap-2 mt-2">
        {item.tags.map((t: string) => (
          <span key={t} className="text-xs bg-neutral-800 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-500 text-sm mt-2"
        >
          Delete
        </button>
      )}
    </div>
  );
}
