import { Route, HashRouter, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BrowseParts from "./pages/BrowseParts";
import Quote from "./pages/Quote";
import About from "./pages/About";

export default function App() {
  return (
    <HashRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseParts />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
