import TechStack from "./TechStack";
import Button from "./Button";

const HIGHLIGHTS = [
    "100K+ Requests/Min Gateway",
    "60% Faster AI Responses",
    "30% Lower P99 Latency",
]

export default function Hero() {
    return (
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">

            <div className="w-full max-w-4xl text-center">

                <h1 className="pixel text-6xl leading-relaxed">
                    Hi,
                    <br />
                    I'm Pratul.
                </h1>

                <p className="mx-auto mt-10 max-w-3xl text-2xl text-gray-300">
                    Python Backend Engineer building scalable APIs,
                    distributed systems and AI powered SaaS products.
                </p>

                <p className="mt-6 text-xl text-orange-500">
                    If you hire me, consider your work done.
                </p>

                <div className="mt-10 flex justify-center gap-5">
                    <Button href="#" className="small-pixel">VIEW RESUME</Button>
                    <Button href="#" className="small-pixel" primary>CONTACT</Button>
                </div>

                <ul className="mt-10 flex flex-wrap justify-center gap-3">
                    {HIGHLIGHTS.map((item) => (
                        <li
                            key={item}
                            className="border border-orange-500/30 bg-orange-500/5 px-3 py-2 tiny-pixel text-xs text-orange-500"
                        >
                        {item}
                        </li>
                    ))}
                </ul>

            </div>

        </section>
    );
}