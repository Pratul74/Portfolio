import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Background from "./components/Background";
import CRT from "./components/CRT";
import SkillCards from "./components/SkillCards";
import About from "./components/About";

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
          <About />
        </section>

        <section id="skills" className="min-h-screen scroll-mt-[90px]">
          <SkillCards />
        </section>

        <section id="contact" className="min-h-screen scroll-mt-[90px]">
          
        </section>
        <Footer />
      </div>
    </>
  );
}