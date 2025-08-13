import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DailyQuizButton from './DailyQuizButton';

const AnimatedHero = ({ onStartTest }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 -mt-20 pt-20 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'  // 🌙 DARK MODE
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'   // ☀️ LIGHT MODE
    }`}>
      
      {/* Premium Animated background blobs - Same for both modes */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full animate-premium-float"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full animate-premium-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-cyan-200/20 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '4s'}}></div>
      
      {/* Premium morphing shapes - Same for both modes */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 animate-morph-shape"></div>
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-pink-300/20 animate-morph-shape" style={{animationDelay: '3s'}}></div>
      
      {/* 🧠 BRAIN ANIMATION - Enhanced glow effects */}
      <div className="flex justify-center mb-12 z-10 relative">
        <div className="relative">
          {/* Enhanced glow effect background - different for dark/light mode */}
          {isDarkMode ? (
            <>
              {/* Dark mode: Whitish glow layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-gray-100/25 rounded-full blur-2xl animate-premium-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-white/20 rounded-full blur-xl animate-premium-glow" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-0 bg-white/15 rounded-full blur-lg animate-premium-glow" style={{animationDelay: '2s'}}></div>
            </>
          ) : (
            <>
              {/* Light mode: Light bluish glow layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/40 to-cyan-300/35 rounded-full blur-2xl animate-premium-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-300/30 to-blue-400/30 rounded-full blur-xl animate-premium-glow" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-0 bg-blue-200/25 rounded-full blur-lg animate-premium-glow" style={{animationDelay: '2s'}}></div>
            </>
          )}
          
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="animate-brain-premium relative z-10">
            {/* Background circle */}
            <circle cx="90" cy="90" r="75" fill="#3498db" opacity="0.15"/>
            {/* Background ellipse */}
            <ellipse cx="90" cy="90" rx="52.5" ry="67.5" fill="#8e44ad" opacity="0.12"/>
            {/* Brain emoji */}
            <text x="50%" y="54%" textAnchor="middle" fill="#34495e" fontSize="60" fontWeight="bold" dy=".3em">🧠</text>
          </svg>
        </div>
      </div>
      
      {/* TEXT CONTENT */}
      <div className={`transition-all duration-1000 mt-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className={`font-display text-4xl md:text-6xl font-bold mb-5 text-center animate-text-reveal tracking-tight ${
          isDarkMode ? 'text-white' : 'text-[#34495e]'
        }`}>
          Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] animate-gradient">Cognitive Profile</span>
        </h1>
        
        <p className={`font-premium text-lg md:text-xl max-w-2xl mx-auto mb-8 text-center animate-fade-in-delay leading-relaxed ${
          isDarkMode ? 'text-white' : 'text-gray-600'
        }`}>
          Challenge your mind with our scientifically-designed IQ test and unlock insights into your intellectual strengths with cutting-edge AI technology.
        </p>
        
        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay">
          <button 
            onClick={onStartTest}
            className="btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Free Test Now
          </button>
          <button 
            onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
            className="btn-premium bg-white/20 backdrop-blur-sm text-[#3498db] border-2 border-[#3498db] font-premium font-bold py-3 px-8 rounded-full text-lg hover:bg-[#3498db] hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ onStartTest }) => {
  const { isDarkMode } = useTheme();
  const [statsValues, setStatsValues] = useState({ tests: 0, accuracy: 0, experience: 0, rating: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateStats = () => {
    const targetValues = { tests: 50000, accuracy: 98, experience: 15, rating: 4.9 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStatsValues({
        tests: Math.floor(targetValues.tests * progress),
        accuracy: Math.floor(targetValues.accuracy * progress),
        experience: Math.floor(targetValues.experience * progress),
        rating: parseFloat((targetValues.rating * progress).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setStatsValues(targetValues);
      }
    }, stepDuration);
  };

  const features = [
    {
      icon: "🧠",
      title: "Scientifically Validated",
      description: "Our tests are based on established cognitive assessment methodologies and validated by leading psychologists worldwide.",
      bgColor: "from-pink-400 to-rose-500",
      gradientOverlay: "from-pink-600/30 to-rose-600/40"
    },
    {
      icon: "🔍",
      title: "Detailed Analysis",
      description: "Get comprehensive insights into your cognitive strengths, weaknesses, and personalized recommendations for improvement.",
      bgColor: "from-blue-400 to-cyan-500",
      gradientOverlay: "from-blue-600/30 to-cyan-600/40"
    },
    {
      icon: "🏆",
      title: "Track Progress",
      description: "Monitor your cognitive development over time with detailed progress reports and performance analytics.",
      bgColor: "from-purple-400 to-violet-500",
      gradientOverlay: "from-purple-600/30 to-violet-600/40"
    }
  ];

  const stats = [
    { key: "tests", label: "Tests Completed", suffix: "K+", bgColor: "from-pink-400 to-rose-500", gradientOverlay: "from-pink-600/30 to-rose-600/40" },
    { key: "accuracy", label: "Accuracy Rate", suffix: "%", bgColor: "from-blue-400 to-cyan-500", gradientOverlay: "from-blue-600/30 to-cyan-600/40" },
    { key: "experience", label: "Years Experience", suffix: "+", bgColor: "from-purple-400 to-violet-500", gradientOverlay: "from-purple-600/30 to-violet-600/40" },
    { key: "rating", label: "User Rating", suffix: "/5", bgColor: "from-indigo-400 to-blue-500", gradientOverlay: "from-indigo-600/30 to-blue-600/40" }
  ];

  const facts = [
    { icon: "🎵", value: "Musical Minds", description: "People who play musical instruments tend to have higher IQ scores and better spatial-temporal reasoning.", bgColor: "from-pink-400 to-rose-500", gradientOverlay: "from-pink-600/30 to-rose-600/40" },
    { icon: "😂", value: "Humor & IQ", description: "Studies show that people with higher IQ scores are better at understanding and creating humor.", bgColor: "from-blue-400 to-cyan-500", gradientOverlay: "from-blue-600/30 to-cyan-600/40" },
    { icon: "🌙", value: "Night Owls", description: "Research suggests that people with higher IQs tend to stay up later and be more active at night.", bgColor: "from-purple-400 to-violet-500", gradientOverlay: "from-purple-600/30 to-violet-600/40" },
    { icon: "🐱", value: "Cat People", description: "Cat owners tend to score higher on intelligence tests compared to dog owners, according to studies.", bgColor: "from-indigo-400 to-blue-500", gradientOverlay: "from-indigo-600/30 to-blue-600/40" }
  ];

  const steps = [
    { number: "1", title: "Take the Test", description: "Complete our scientifically-designed IQ assessment in just 30 minutes", bgColor: "from-pink-400 to-rose-500", gradientOverlay: "from-pink-600/30 to-rose-600/40" },
    { number: "2", title: "Get Your Results", description: "Receive detailed analysis of your cognitive strengths and areas for improvement", bgColor: "from-blue-400 to-cyan-500", gradientOverlay: "from-blue-600/30 to-cyan-600/40" },
    { number: "3", title: "Track Progress", description: "Monitor your cognitive development and practice to improve your score", bgColor: "from-purple-400 to-violet-500", gradientOverlay: "from-purple-600/30 to-violet-600/40" }
  ];

  return (
    <div>
      <DailyQuizButton />
      <AnimatedHero onStartTest={onStartTest} />
      
      {/* Premium Features Section */}
      <section id="features-section" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-pink-100/40 to-blue-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative mb-8">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] tracking-tight">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] animate-gradient">IQScalar</span>?
            </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Experience the most advanced cognitive assessment platform designed to unlock your intellectual potential with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`relative group text-center p-10 bg-gradient-to-br ${feature.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 border border-white/40 overflow-hidden backdrop-blur-sm min-h-[360px]`}
                style={{
                  animationDelay: `${index * 250}ms`,
                  animation: 'fadeInUp 1.2s ease-out forwards'
                }}
              >
                {/* Premium layered gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradientOverlay} opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/20 rounded-3xl"></div>
                
                {/* Premium shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Enhanced corner accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/40 to-transparent rounded-br-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tl-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium floating orbs */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{animationDelay: '0.4s'}}></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                  {/* Icon with premium styling */}
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg mx-auto">
                    <span className="text-3xl flex items-center justify-center leading-none">{feature.icon}</span>
                  </div>
                  
                  <div className="font-display text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500 tracking-tight text-center leading-tight">
                    {feature.title}
                  </div>
                  <div className="font-premium text-white/90 group-hover:text-white font-medium text-base leading-relaxed transition-colors duration-500 text-center max-w-sm mx-auto">
                    {feature.description}
                  </div>
                  
                  {/* Premium glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 group-hover:bg-white/60 transition-all duration-500 rounded-b-3xl"></div>
                  
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl shadow-inner opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section id="stats-section" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative mb-8">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] tracking-tight">
              Trusted by Thousands
            </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Join a global community of forward-thinking individuals who have unlocked their cognitive potential through our scientifically-validated assessments
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`relative group text-center p-12 bg-gradient-to-br ${stat.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 border border-white/40 overflow-hidden backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 250}ms`,
                  animation: 'fadeInUp 1.2s ease-out forwards'
                }}
              >
                {/* Premium layered gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientOverlay} opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/20 rounded-3xl"></div>
                
                {/* Premium shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Enhanced corner accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/40 to-transparent rounded-br-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tl-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium floating orbs */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{animationDelay: '0.4s'}}></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="font-display text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500 tracking-tight text-center">
                    {stat.key === 'tests' ? Math.floor(statsValues.tests / 1000) : statsValues[stat.key]}{stat.suffix}
                </div>
                  <div className="font-premium text-white/90 group-hover:text-white font-bold text-lg tracking-wider transition-colors duration-500 uppercase text-center mb-6">
                    {stat.label}
                </div>
                  
                  {/* Premium glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 group-hover:bg-white/60 transition-all duration-500 rounded-b-3xl"></div>
                  
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl shadow-inner opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium testimonial hint */}
          <div className="text-center mt-16">
            <p className="font-premium text-gray-500 italic text-lg max-w-2xl mx-auto">
              "The most comprehensive and accurate cognitive assessment platform I've ever used" — Dr. Sarah Chen, Cognitive Psychologist
            </p>
          </div>
        </div>
      </section>

      {/* Premium Facts Section */}
      <section id="facts-section" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-orange-100/40 to-red-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-100/40 to-green-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative mb-8">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] tracking-tight">
              Did You Know?
            </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Discover amazing and surprising facts about IQ, intelligence, and the human brain
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {facts.map((fact, index) => (
              <div 
                key={index}
                className={`relative group text-center p-8 bg-gradient-to-br ${fact.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 border border-white/40 overflow-hidden backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 250}ms`,
                  animation: 'fadeInUp 1.2s ease-out forwards'
                }}
              >
                {/* Premium layered gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${fact.gradientOverlay} opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/20 rounded-3xl"></div>
                
                {/* Premium shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Enhanced corner accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/40 to-transparent rounded-br-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tl-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium floating orbs */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{animationDelay: '0.4s'}}></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Icon with premium styling */}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                  {fact.icon}
                  </div>
                  
                  <div className="font-display text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-3 group-hover:scale-110 transition-transform duration-500 tracking-tight text-center">
                    {fact.value}
                  </div>
                  <div className={`font-premium text-white/90 group-hover:text-white font-medium text-sm leading-relaxed transition-colors duration-500 text-center mb-6`}>
                    {fact.description}
                  </div>
                  
                  {/* Premium glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 group-hover:bg-white/60 transition-all duration-500 rounded-b-3xl"></div>
                  
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl shadow-inner opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium How It Works Section */}
      <section id="how-it-works-section" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-pink-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative mb-8">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] tracking-tight">
              How It Works
            </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Get your cognitive assessment in just three simple steps with our streamlined process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative group text-center p-8 bg-gradient-to-br ${step.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 border border-white/40 overflow-hidden backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 250}ms`,
                  animation: 'fadeInUp 1.2s ease-out forwards'
                }}
              >
                {/* Premium layered gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradientOverlay} opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/20 rounded-3xl"></div>
                
                {/* Premium shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Enhanced corner accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/40 to-transparent rounded-br-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tl-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium floating orbs */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{animationDelay: '0.4s'}}></div>
                
                {/* Step connector lines */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/30 transform -translate-y-1/2 z-20"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Number with premium styling */}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                    <span className="text-2xl font-black text-white leading-none flex items-center justify-center">{step.number}</span>
                  </div>
                  
                  <div className="font-display text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-3 group-hover:scale-110 transition-transform duration-500 tracking-tight text-center">
                    {step.title}
                  </div>
                  <div className={`font-premium text-white/90 group-hover:text-white font-medium text-sm leading-relaxed transition-colors duration-500 text-center ${index === 1 ? 'mb-4' : ''}`}>
                    {step.description}
                  </div>
                  
                  {/* Premium glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 group-hover:bg-white/60 transition-all duration-500 rounded-b-3xl"></div>
                  
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl shadow-inner opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Premium CTA Section */}
      <section id="cta-section" className={`py-20 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-premium-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className={`max-w-5xl mx-auto p-12 backdrop-blur-xl rounded-3xl shadow-2xl border relative overflow-hidden group transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/90 to-gray-700/70 border-gray-600/40' 
              : 'bg-gradient-to-br from-white/90 to-white/70 border-white/40'
          }`}>
            {/* Premium card effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent"></div>
            
            {/* Enhanced floating orbs */}
            <div className="absolute top-8 right-8 w-4 h-4 bg-blue-400/60 rounded-full animate-ping"></div>
            <div className="absolute top-12 right-16 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-8 left-8 w-3 h-3 bg-pink-400/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            
            {/* Enhanced brain icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full flex items-center justify-center text-6xl mx-auto animate-premium-glow shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                🧠
              </div>
              {/* Rotating ring */}
              <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-blue-400/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] animate-gradient tracking-tight">
              Ready to Test Your Intelligence?
            </h2>
              <p className={`font-premium text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-white' : 'text-gray-600'
              }`}>
                Join <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] to-[#8e44ad]">50,000+ users</span> who have discovered their cognitive potential with our comprehensive IQ assessment powered by cutting-edge AI technology.
              </p>
              
              {/* Enhanced buttons with better effects */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={onStartTest}
                  className="group relative btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    🚀 Start Your Free Test Now
                  </span>
              </button>
              <button 
                onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
                  className="group relative btn-premium bg-white/30 backdrop-blur-sm text-[#3498db] border-2 border-[#3498db]/50 font-premium font-bold py-4 px-12 rounded-full text-lg hover:bg-gradient-to-r hover:from-[#3498db] hover:to-[#8e44ad] hover:text-white hover:border-transparent transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                  <span className="relative z-10 flex items-center justify-center">
                    ✨ Learn More
                  </span>
              </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                <div className={`flex items-center font-premium ${
                  isDarkMode ? 'text-white' : 'text-gray-600'
                }`}>
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Scientifically Validated</span>
                </div>
                <div className={`flex items-center font-premium ${
                  isDarkMode ? 'text-white' : 'text-gray-600'
                }`}>
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">100% Free</span>
                </div>
                <div className={`flex items-center font-premium ${
                  isDarkMode ? 'text-white' : 'text-gray-600'
                }`}>
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Instant Results</span>
                </div>
                <div className={`flex items-center font-premium ${
                  isDarkMode ? 'text-white' : 'text-gray-600'
                }`}>
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 