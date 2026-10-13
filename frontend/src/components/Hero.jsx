import Terminal from "./Terminal";
import TechStack from "./TechStack";
import Button from "./Button";

export default function Hero() {
    return (
        <section className="grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.4fr_0.9fr] lg:gap-16">

            {/* Left Side */}
            <div className="flex-1">

                <h1 className="pixel text-6xl leading-relaxed">
                    Hi,
                    <br />
                    I'm Pratul.
                </h1>

                <p className="mt-10 text-2xl text-gray-300">
                    Python Backend Engineer building scalable APIs,
                    distributed systems and AI powered SaaS products.
                </p>

                <p className="mt-6 text-xl text-orange-500">
                    If you hire me, consider your work done.
                </p>

                <div className="mt-10 flex gap-5">
                    <Button href="#">VIEW RESUME</Button>
                    <Button href="#" primary>CONTACT</Button>
                        
                </div>

                <TechStack />

            </div>

            {/* Right Side */}
            <div className="w-full self-center lg:max-w-[420px] lg:justify-self-end">

                <Terminal />

            </div>

        </section>
    );
}