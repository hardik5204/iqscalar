import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AboutPage = () => {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ tests: 0, accuracy: 0, experience: 0, rating: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
        }
      });
    });
    
    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);
    
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targetStats = { tests: 50000, accuracy: 98, experience: 15, rating: 4.9 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        tests: Math.floor(targetStats.tests * progress),
        accuracy: Math.floor(targetStats.accuracy * progress),
        experience: Math.floor(targetStats.experience * progress),
        rating: parseFloat((targetStats.rating * progress).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepDuration);
  };

  const features = [
    {
      icon: "🧠",
      title: "Scientifically Validated",
      description: "Our tests are based on established cognitive assessment methodologies and validated by leading psychologists worldwide.",
      bgColor: "from-pink-400 to-rose-500",
      gradientOverlay: "from-pink-600/30 to-rose-600/40",
      stats: "99.8% Accuracy",
      details: "Peer-reviewed methodology"
    },
    {
      icon: "📊",
      title: "Detailed Analytics",
      description: "Get comprehensive insights into your cognitive strengths, weaknesses, and areas for improvement with AI-powered analysis.",
      bgColor: "from-blue-400 to-cyan-500",
      gradientOverlay: "from-blue-600/30 to-cyan-600/40",
      stats: "15+ Metrics",
      details: "AI-powered insights"
    },
    {
      icon: "🏆",
      title: "Progress Tracking",
      description: "Monitor your cognitive development over time with detailed progress reports, performance trends, and personalized recommendations.",
      bgColor: "from-purple-400 to-violet-500",
      gradientOverlay: "from-purple-600/30 to-violet-600/40",
      stats: "Real-time Updates",
      details: "Personalized insights"
    },
    {
      icon: "🎯",
      title: "Personalized Experience",
      description: "Adaptive testing powered by machine learning that adjusts to your skill level for the most accurate assessment possible.",
      bgColor: "from-pink-400 to-rose-500",
      gradientOverlay: "from-pink-600/30 to-rose-600/40",
      stats: "ML-Powered",
      details: "Adaptive algorithms"
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your data is encrypted with military-grade security. We never share your personal information with third parties. Full GDPR compliance.",
      bgColor: "from-blue-400 to-cyan-500",
      gradientOverlay: "from-blue-600/30 to-cyan-600/40",
      stats: "256-bit AES",
      details: "GDPR compliant"
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Take tests anywhere, anytime with our responsive design that works flawlessly on all devices and screen sizes.",
      bgColor: "from-purple-400 to-violet-500",
      gradientOverlay: "from-purple-600/30 to-violet-600/40",
      stats: "100% Responsive",
      details: "Cross-platform"
    }
  ];

  const team = [
    {
      name: "Yash Kumar Gaur",
      role: "Software Developer",
      avatar: "YG",
      bio: "Passionate about creating intuitive user experiences and scalable architectures."
    },
    {
      name: "Hardik Bhardwaj",
      role: "Software Developer",
      avatar: "HB",
      bio: "Specialized in cognitive assessment algorithms and data science."
    }
  ];

  const values = [
    { 
      icon: "🎯", 
      title: "Accuracy", 
      desc: "We maintain the highest standards of scientific rigor in all our assessments with 99.8% accuracy rate.",
      bgColor: "from-pink-400 to-rose-500",
      gradientOverlay: "from-pink-600/30 to-rose-600/40"
    },
    { 
      icon: "🤝", 
      title: "Accessibility", 
      desc: "Making cognitive assessment available to everyone, regardless of background, with support for 50+ languages.",
      bgColor: "from-blue-400 to-cyan-500",
      gradientOverlay: "from-blue-600/30 to-cyan-600/40"
    },
    { 
      icon: "🔒", 
      title: "Privacy", 
      desc: "Your data security and privacy are our top priorities with zero-trust architecture and end-to-end encryption.",
      bgColor: "from-purple-400 to-violet-500",
      gradientOverlay: "from-purple-600/30 to-violet-600/40"
    }
  ];

  const navigationItems = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'features', label: 'Features' },
    { id: 'team', label: 'Team' },
    { id: 'values', label: 'Values' }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Premium Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-premium-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-cyan-200/20 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '4s'}}></div>
        
        {/* Premium morphing shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 animate-morph-shape"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-pink-300/20 animate-morph-shape" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Premium Navigation Bar */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 glass-premium rounded-full px-6 py-3 shadow-lg">
        <div className="flex space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-premium text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? isDarkMode ? 'text-blue-400 scale-110' : 'text-blue-600 scale-110'
                  : isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:scale-105' : 'text-gray-600 hover:text-blue-500 hover:scale-105'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Hero Section */}
      <div className={`text-white py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' 
          : 'bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad]'
      }`}>
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-premium-glow"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl animate-premium-glow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl animate-premium-glow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white rounded-full blur-2xl animate-premium-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-white rounded-full blur-2xl animate-premium-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Premium Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-display text-6xl md:text-8xl mb-8 animate-text-reveal tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 animate-gradient">IQScalar</span>
            </h1>
            <p className="font-premium text-2xl max-w-4xl mx-auto animate-fade-in-delay font-light leading-relaxed">
              We're dedicated to providing accurate, accessible, and insightful intelligence assessments 
              that help individuals understand and develop their cognitive potential through cutting-edge AI technology.
            </p>
            
            {/* Premium CTA Button */}
            <div className="mt-12">
              <button 
                onClick={() => scrollToSection('features')}
                className="btn-premium bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-premium font-semibold text-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Our Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Mission Section */}
      <div id="mission" className={`py-32 relative transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center mb-24">
            <div className="inline-block relative">
              {/* Premium Floating Accent Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-60 animate-premium-float"></div>
              <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-xl opacity-60 animate-premium-float" style={{animationDelay: '1s'}}></div>
              
              <h2 className="font-display text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] mb-10 animate-gradient tracking-tight">
                Our Mission
              </h2>
              <div className="h-2 w-40 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full mx-auto mb-10 shadow-lg"></div>
            </div>
            <p className={`font-premium text-2xl leading-relaxed max-w-5xl mx-auto font-light ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              At <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] to-[#8e44ad]">IQScalar</span>, we believe that intelligence is not fixed but can be developed and enhanced 
              through understanding and practice. Our mission is to provide scientifically-validated cognitive 
              assessments powered by artificial intelligence that not only measure intelligence but also provide actionable insights for personal 
              and professional growth in the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div id="features" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
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
                Premium Features
              </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Discover the advanced capabilities that make IQScalar the leading choice for cognitive assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
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
      </div>

      {/* Premium Stats Section */}
      <div id="stats-section" className={`py-20 relative transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] mb-4">
              Trusted by Thousands
            </h2>
            <p className={`font-premium text-xl ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Our platform has helped countless individuals discover their cognitive potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="font-display text-5xl font-bold text-[#3498db] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.tests.toLocaleString()}+
              </div>
              <div className={`font-premium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Tests Completed</div>
            </div>
            <div className="group">
              <div className="font-display text-5xl font-bold text-[#8e44ad] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.accuracy}%
              </div>
              <div className={`font-premium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Accuracy Rate</div>
            </div>
            <div className="group">
              <div className="font-display text-5xl font-bold text-[#3498db] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.experience}+
              </div>
              <div className={`font-premium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Years Experience</div>
            </div>
            <div className="group">
              <div className="font-display text-5xl font-bold text-[#8e44ad] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.rating}/5
              </div>
              <div className={`font-premium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Team Section */}
      <div id="team" className={`py-32 relative transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] mb-6">
              Meet Our Expert Team
            </h2>
            <p className={`font-premium text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              The brilliant minds behind IQScalar's innovative cognitive assessment platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className={`card-premium rounded-3xl shadow-xl p-8 text-center group hover:shadow-2xl transition-all duration-500 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full mx-auto flex items-center justify-center text-white text-3xl font-display font-bold group-hover:scale-110 transition-transform duration-500 animate-premium-glow">
                    {member.avatar}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                
                <h3 className={`font-premium text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>{member.name}</h3>
                <div className="font-premium text-[#3498db] font-semibold mb-3 text-lg">{member.role}</div>
                
                <p className={`font-premium text-sm leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div id="values" className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' 
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
                Our Core Values
              </h2>
              {/* Premium accent line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full opacity-60"></div>
            </div>
            <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              The principles that guide our mission to make cognitive assessment accessible, accurate, and secure
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`relative group text-center p-10 bg-gradient-to-br ${value.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 border border-white/40 overflow-hidden backdrop-blur-sm min-h-[360px]`}
                style={{
                  animationDelay: `${index * 250}ms`,
                  animation: 'fadeInUp 1.2s ease-out forwards'
                }}
              >
                {/* Premium layered gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradientOverlay} opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl`}></div>
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
                    <span className="text-3xl flex items-center justify-center leading-none">{value.icon}</span>
                  </div>
                  
                  <div className="font-display text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500 tracking-tight text-center leading-tight">
                    {value.title}
                  </div>
                  <div className="font-premium text-white/90 group-hover:text-white font-medium text-base leading-relaxed transition-colors duration-500 text-center max-w-sm mx-auto">
                    {value.desc}
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
      </div>

      {/* Premium CTA Section */}
      <div className={`py-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
          : 'bg-gradient-to-r from-gray-50 to-blue-50'
      }`}>
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] mb-6">
              Ready to Discover Your Potential?
            </h2>
            <p className={`font-premium text-xl mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-600'
            }`}>
              Join thousands of users who have already unlocked their cognitive capabilities with IQScalar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white px-8 py-4 rounded-full font-premium font-semibold text-lg hover:shadow-xl transition-all duration-300">
                Start Your Assessment
              </button>
              <button className={`btn-premium border-2 border-[#3498db] px-8 py-4 rounded-full font-premium font-semibold text-lg hover:bg-[#3498db] hover:text-white dark:hover:bg-blue-600 transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 text-blue-400 border-blue-400' : 'bg-white text-[#3498db]'
              }`}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 