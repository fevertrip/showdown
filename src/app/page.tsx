import TicTacToe from "@/components/TicTacToe";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="w-full py-6 bg-white dark:bg-slate-950 shadow-sm">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] p-[3px]">
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
                <div className="bg-white/20 rounded-sm"></div>
              </div>
              <span className="relative text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI Tic Tac Toe Showdown
            </h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <TicTacToe />
      </div>
      
      <footer className="w-full py-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <div className="text-sm mb-2">AI versus AI — Watch language models battle it out in Tic Tac Toe</div>
          <div className="text-xs">Powered by OpenAI API</div>
        </div>
      </footer>
    </main>
  );
}
