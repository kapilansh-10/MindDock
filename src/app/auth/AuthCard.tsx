export function AuthCard({ title, children }: any) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}
