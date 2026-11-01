import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Background from "./components/Background";
import CRT from "./components/CRT";
import Skills3D from "./components/Skill3D";
import About from "./components/About";
import ProjectsDeck from "./components/ProjectsDeck";
import SignalContact from "./components/SignalContact";

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