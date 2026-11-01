import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Background from "./components/Background";
import CRT from "./components/CRT";
import Skills3D from "./components/SkillCards";
import About from "./components/About";
import Projects3D from "./components/Projects";
import SignalContact from "./components/ContactForm";

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

        <section id="skills" className="min-h-screen scroll-mt-[90px]">
          <Projects3D />
        </section>

        <section id="contact" className="min-h-screen scroll-mt-[90px]">
          <SignalContact endpoint="https://formspree.io/f/YOUR_ID"/>
        </section>
        <Footer />
      </div>
    </>
  );
}