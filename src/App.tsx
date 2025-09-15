import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import CayaChatWidget from "@/components/CayaChatWidget";

const Home = lazy(() => import("@/pages/Home"));
const SignupOCR = lazy(() => import("@/pages/SignupOCR"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup/ocr" element={<SignupOCR />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App(): JSX.Element {
  return (
    <Router>
      <ScrollToTop />
      {/* Global floating chat widget */}
      <CayaChatWidget />
      <Suspense fallback={null}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}
