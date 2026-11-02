import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Footer from "./components/layout/Footer";
import Background from "./components/effects/Background";
import CRT from "./components/effects/CRT";
import Skills3D from "./components/sections/Skill3D";
import About from "./components/sections/About";
import ProjectsDeck from "./components/sections/ProjectsDeck";
import SignalContact from "./components/sections/SignalContact";

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
          <Skills3D />
        </section>

        <section id="projects" className="min-h-screen scroll-mt-[90px]">
          <ProjectsDeck />
        </section>

        <section id="contact" className="min-h-screen scroll-mt-[90px]">
          <SignalContact endpoint="https://formspree.io/f/YOUR_ID"/>
        </section>
        <Footer />
      </div>
    </>
  );
}