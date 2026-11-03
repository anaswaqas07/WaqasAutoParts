import { Route, HashRouter, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PartsIndex from "./pages/PartsIndex";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <HashRouter>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<PartsIndex />} />
          <Route path="/parts/:slug" element={<CategoryPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
