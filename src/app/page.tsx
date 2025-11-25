
export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">

      <h1 className="text-6xl font-extrabold text-center  mb-6">
        Your Second Brain,
        <br />
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Supercharged
        </span>
      </h1>

      <p className="text-gray-300 text-lg md:text-xl text-center max-w-2xl mb-10"> 
        Save links, videos, tweets, ideas — everything you learn.  
        Organize your knowledge. Share it with one beautiful public link.
      </p>

    <div className="flex gap-4 mb-16">
      <a 
        href="/signup"
        className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold"
      >
        Get Started
      </a>

      <a 
        href="/signup"
        className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold"
      >
        Login
      </a>
    </div>

    <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">

      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h3 className="text-xl font-semibold mb-2">Save Anything</h3>
          <p className="text-gray-400">Links, YouTube videos, tweets, notes — your entire digital brain in one place.</p>
        </div>

      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
          <p className="text-gray-400">Open, search, and manage your knowledge from anywhere.</p>
      </div>


      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h3 className="text-xl font-semibold mb-2">Share with One Link</h3>
          <p className="text-gray-400">Generate a public MindDock page and showcase your learning journey.</p>
      </div>
      
    </div>



    </main>
  );
}
