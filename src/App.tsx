function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '20%', left: '80%', animationDelay: '0.5s' }}></div>
        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '40%', left: '10%', animationDelay: '1s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '60%', left: '90%', animationDelay: '1.5s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '80%', left: '30%', animationDelay: '2s' }}></div>
        <div className="absolute w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{ top: '15%', left: '60%', animationDelay: '0.3s' }}></div>
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ top: '70%', left: '70%', animationDelay: '1.2s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '30%', left: '50%', animationDelay: '0.8s' }}></div>
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-8 animate-bounce">
              <span className="inline-block px-6 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 text-purple-200 rounded-full text-sm font-semibold">🚀 Welcome to Space</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-pulse">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">Starter Pack</span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-2xl mx-auto">Explore the universe of possibilities with modern web development</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110">
                <span className="flex items-center justify-center gap-2">
                  Launch App
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-110">Learn More</button>
            </div>

            <div className="mt-20 flex justify-center gap-8 flex-wrap">
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform hover:scale-105 transition-all hover:bg-white/10 animate-pulse" style={{ animationDelay: '0s' }}>
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-semibold">Fast</div>
              </div>
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform hover:scale-105 transition-all hover:bg-white/10 animate-pulse" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-white font-semibold">Beautiful</div>
              </div>
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform hover:scale-105 transition-all hover:bg-white/10 animate-pulse" style={{ animationDelay: '0.6s' }}>
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-white font-semibold">Secure</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-purple-300/60 text-sm">
          <p>Mahesgya • 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
