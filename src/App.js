import React, { useState, useEffect } from "react";
import { ClerkProvider, useUser, useClerk } from "@clerk/clerk-react";
import ClerkSignIn from "./components/ClerkSignIn";
import ClerkSignUp from "./components/ClerkSignUp";
import HomePage from "./components/HomePage";
import PricingPage from "./components/PricingPage";
import TestPage from "./components/TestPage";
import ResultsPage from "./components/ResultsPage";
import AboutPage from "./components/AboutPage";
import PracticePage from "./components/PracticePage";
import ContactPage from "./components/ContactPage";
import AccountPage from "./components/AccountPage";
import Logo from "./components/Logo";
import ThemeToggle from "./components/ThemeToggle";
import "./index.css";

function AppContent() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [page, setPage] = useState("home");
  const [testResults, setTestResults] = useState(null);
  const [practiceQuestions, setPracticeQuestions] = useState(null);
  const [practiceCategory, setPracticeCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToPage = (pageName) => {
    setPage(pageName);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleStartTest = () => setPage("test");
  const handleCompleteTest = (results) => {
    setTestResults(results);
    setPage("results");
  };
  const handleRetakeTest = () => setPage("test");

  const handleLogout = async () => {
    await signOut();
    setPage("home");
  };

  const handleSubscribe = () => setPage("account");
  const handleStartPractice = (questions, category) => {
    setPracticeQuestions(questions);
    setPracticeCategory(category);
    setPage("practice-test");
  };
  
  const handleCompletePractice = (results) => {
    setTestResults(results);
    setPage("practice-results");
  };
  
  const handleBackToPractice = () => {
    setPracticeQuestions(null);
    setPracticeCategory(null);
    setPage("practice");
  };

  const handleDownloadCertificate = () => alert("Certificate download feature coming soon!");
  let content;
  switch (page) {
    case "home":
      content = <HomePage onStartTest={handleStartTest} />;
      break;
    case "about":
      content = <AboutPage />;
      break;
    case "pricing":
      content = <PricingPage onSubscribe={handleSubscribe} />;
      break;
    case "test":
      content = <TestPage onComplete={handleCompleteTest} />;
      break;
    case "results":
      content = (
        <ResultsPage
          results={testResults}
          onDownloadCertificate={handleDownloadCertificate}
          onRetakeTest={handleRetakeTest}
        />
      );
      break;
    case "login":
      content = <ClerkSignIn />;
      break;
    case "signup":
      content = <ClerkSignUp />;
      break;
    case "practice":
      content = <PracticePage onStartPractice={handleStartPractice} />;
      break;
    case "practice-test":
      content = (
        <TestPage 
          questions={practiceQuestions}
          category={practiceCategory}
          isPractice={true}
          onComplete={handleCompletePractice}
        />
      );
      break;
    case "practice-results":
      content = (
        <ResultsPage
          results={testResults}
          isPractice={true}
          onBackToPractice={handleBackToPractice}
          onRetakeTest={() => setPage("practice-test")}
        />
      );
      break;
    case "contact":
      content = <ContactPage />;
      break;
    case "account":
      content = <AccountPage />;
      break;
    default:
      content = <HomePage onStartTest={handleStartTest} />;
  }

  const navigationItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
    { name: "Pricing", id: "pricing" },
    { name: "Practice", id: "practice" },
    { name: "My Account", id: "account" },
    { name: "Download Certificate", id: "certificate" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Premium Fixed Header */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-premium shadow-lg backdrop-blur-xl dark:bg-gray-900/95' 
          : 'bg-white/95 backdrop-blur-sm dark:bg-gray-900/95'
      }`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="cursor-pointer group flex-shrink-0"
            onClick={() => handleGoToPage("home")}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Logo className="w-16 h-16" size="large" />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 flex-1 justify-center">
            {navigationItems.map((navItem) => (
              <button
                key={navItem.id}
                className={`font-premium font-medium text-sm transition-all duration-300 relative group ${
                  page === navItem.id 
                    ? 'text-[#3498db] scale-110' 
                    : 'text-[#34495e] dark:text-gray-200 hover:text-[#3498db] hover:scale-105'
                }`}
                onClick={() => handleGoToPage(navItem.id)}
              >
                {navItem.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3498db] to-[#8e44ad] transition-all duration-300 group-hover:w-full ${
                  page === navItem.id ? 'w-full' : ''
                }`}></span>
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle & Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {isSignedIn && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.imageUrl && (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    />
                  )}
                  <span className="font-premium text-sm text-[#34495e] dark:text-gray-200 hidden sm:block">
                    {user.fullName}
                  </span>
                </div>
                <button
                  className="font-premium font-semibold text-sm px-4 py-2 rounded-full transition-all duration-300 text-red-600 hover:text-white hover:bg-red-600 border border-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 hidden md:flex">
                <button
                  className={`font-premium font-semibold text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                    page === "signup" 
                      ? 'bg-gradient-to-r from-[#8e44ad] to-[#e74c3c] text-white shadow-lg' 
                      : 'text-[#8e44ad] hover:text-white hover:bg-gradient-to-r hover:from-[#8e44ad] hover:to-[#e74c3c] border-2 border-[#8e44ad]'
                  }`}
                  onClick={() => handleGoToPage("signup")}
                >
                  {page === "signup" ? "Active" : "Sign Up"}
                </button>
                <button
                  className={`font-premium font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 ${
                    page === "login" 
                      ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white shadow-lg' 
                      : 'text-[#3498db] hover:text-white hover:bg-gradient-to-r hover:from-[#3498db] hover:to-[#8e44ad] border-2 border-[#3498db]'
                  }`}
                  onClick={() => handleGoToPage("login")}
                >
                  {page === "login" ? "Active" : "Login"}
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigationItems.map((navItem) => (
                <button
                  key={navItem.id}
                  className={`block w-full text-left py-3 px-4 rounded-lg font-premium font-medium transition-all duration-300 ${
                    page === navItem.id 
                      ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white' 
                      : 'text-[#34495e] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleGoToPage(navItem.id)}
                >
                  {navItem.name}
                </button>
              ))}
              {isSignedIn && user ? (
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {user.imageUrl && (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      />
                    )}
                    <span className="font-premium text-sm text-[#34495e]">
                      {user.fullName}
                    </span>
                  </div>
                  <button
                    className="font-premium font-semibold text-sm px-3 py-1 rounded-full transition-all duration-300 text-red-600 hover:text-white hover:bg-red-600 border border-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className={`block w-full text-left py-3 px-4 rounded-lg font-premium font-medium transition-all duration-300 ${
                      page === "signup" 
                        ? 'bg-gradient-to-r from-[#8e44ad] to-[#e74c3c] text-white' 
                        : 'text-[#8e44ad] hover:bg-purple-50'
                    }`}
                    onClick={() => handleGoToPage("signup")}
                  >
                    {page === "signup" ? "Active" : "Sign Up"}
                  </button>
                  <button
                    className={`block w-full text-left py-3 px-4 rounded-lg font-premium font-medium transition-all duration-300 ${
                      page === "login" 
                        ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white' 
                        : 'text-[#3498db] hover:bg-blue-50'
                    }`}
                    onClick={() => handleGoToPage("login")}
                  >
                    {page === "login" ? "Active" : "Login"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 bg-white dark:bg-gray-900 transition-colors duration-300">{content}</main>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 py-16 relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-premium-float"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Logo className="w-16 h-16" size="large" />
              </div>
              <p className="font-premium text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Discover your cognitive potential with our scientifically-designed IQ tests.
                Get detailed insights into your intellectual strengths and track your progress over time with cutting-edge AI technology.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "✉️", label: "Email", color: "hover:text-blue-600" },
                  { icon: "📱", label: "Mobile", color: "hover:text-green-600" },
                  { icon: "X", label: "Twitter", color: "hover:text-sky-600" },
                  { icon: "💼", label: "LinkedIn", color: "hover:text-blue-700" }
                ].map((social, index) => (
                  <button 
                    key={index}
                    className={`text-[#000000] ${social.color} transition-all duration-300 transform hover:scale-110 hover:rotate-6`}
                    title={social.label}
                  >
                    <span className="text-2xl">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-premium text-lg font-semibold mb-6 text-[#34495e] dark:text-gray-200">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "About Us", id: "about" },
                  { name: "Pricing Plans", id: "pricing" },
                  { name: "Practice Tests", id: "practice" },
                  { name: "Contact Us", id: "contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleGoToPage(link.id)} 
                      className="font-premium text-gray-600 hover:text-[#3498db] transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-2 mr-2"></span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-premium text-lg font-semibold mb-6 text-[#34495e] dark:text-gray-200">Support</h4>
              <ul className="space-y-3">
                {[
                  { name: "Login", id: "login" },
                  { name: "My Account", id: "account" },
                  { name: "Terms of Service", id: "terms" },
                  { name: "Help Center", id: "contact" },
                  { name: "Download Certificate", id: "certificate" }
                ].map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleGoToPage(link.id)} 
                      className="font-premium text-gray-600 dark:text-gray-300 hover:text-[#3498db] transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-2 mr-2"></span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Bottom Footer */}
          <div className="border-t border-gray-300/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="font-premium text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 <span className="font-semibold text-[#3498db]">IQScalar</span>. All rights reserved.
            </div>
            <div className="flex space-x-8">
              {[
                { name: "Privacy Policy", id: "terms" },
                { name: "Terms of Service", id: "terms" },
                { name: "Cookie Policy", id: "contact" }
              ].map((link, index) => (
                <button 
                  key={index}
                  onClick={() => handleGoToPage(link.id)} 
                  className="font-premium text-gray-600 dark:text-gray-300 hover:text-[#3498db] text-sm transition-all duration-300 hover:scale-105"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey="pk_test_bWFnbmV0aWMtamFndWFyLTI0LmNsZXJrLmFjY291bnRzLmRldiQ">
      <AppContent />
    </ClerkProvider>
  );
}

export default App;