import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
    <ScrollToTop />
    <PageTransition>
      <AppRoutes />
      <Footer />
    </PageTransition>
    </>
  );
}

export default App;