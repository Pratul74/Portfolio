import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Background from "./components/Background";
import CRT from "./components/CRT";
import Terminal from "./components/Terminal";
import TechStack from "./components/TechStack";

export default function App() {
  return (
    <>
      <Background />
      <CRT />

      <div className="min-h-screen border-2 border-orange-600 text-white">
        <Navbar />

        <section id="home" className="min-h-screen scroll-mt-[90px]">
          <Hero />
        </section>

        <section id="about" className="min-h-screen scroll-mt-[90px]">
          {/* put your About content here */}
        </section>

        <section id="projects" className="min-h-screen scroll-mt-[90px]">
          <Terminal />
        </section>

        <section id="skills" className="min-h-screen scroll-mt-[90px]">
          <TechStack />
        </section>

        <section id="contact" className="min-h-screen scroll-mt-[90px]">
          <Footer />
        </section>
      </div>
    </>
  );
}