export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <a
            href="https://github.com/efan-mc/pokemon-team"
            target="_blank"
            className="hover:text-gray-200 transition-colors"
          >
            GitHub
          </a>
          <span className="hidden md:inline">•</span>
          <p>© Pokémon is a trademark of Nintendo./GAME FREAK inc.</p>
        </div>
      </div>
    </footer>
  );
}
