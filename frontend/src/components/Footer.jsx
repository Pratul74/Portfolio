export default function Footer() {
    return (
        <footer className="border-t border-orange-600 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">

                <div className="font-mono text-sm uppercase tracking-widest text-orange-500">
                    @ Pratul Kumar 
                </div>

                <nav className="flex gap-8 font-mono text-sm tracking-wider text-gray-300">

                    <a
                        href="https://github.com/Pratul74"
                        className="transition-colors hover:text-orange-500"
                    >
                        [GITHUB]
                    </a>

                    <a
                        href="https://www.linkedin.com/in/pratul74/"
                        className="transition-colors hover:text-orange-500"
                    >
                        [LINKEDIN]
                    </a>

                </nav>

            </div>
        </footer>
    );
}