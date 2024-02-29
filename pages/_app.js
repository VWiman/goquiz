import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { QuizProvider } from "@/context/QuizContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <QuizProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </QuizProvider>
  );
}

export default MyApp;
