import Link from "next/link";
import { FileText, Github } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">FinePrint <span className="text-blue-500">AI</span></span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/upload" className="text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium">New Analysis</Link>
                            <Link href="/history" className="text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium">History</Link>
                            <Link href="https://github.com/zaid6isthename-bit/FinePrint-AI" target="_blank" className="text-zinc-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
