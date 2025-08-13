import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ContactPage = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: "✉️",
      title: "Email Support",
      description: "Get help via email",
      contact: "iqscalar@gmail.com",
      response: "Within 24 hours"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      response: "Instant response"
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Call us directly",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: "📱",
      title: "WhatsApp",
      description: "Message us on WhatsApp",
      contact: "+1 (555) 123-4567",
      response: "Within 2 hours"
    }
  ];

  const faqData = [
    {
      question: "How accurate are your IQ tests?",
      answer: "Our tests are scientifically validated and have been calibrated against established intelligence scales. They provide reliable results with a high degree of accuracy."
    },
    {
      question: "Can I retake the test?",
      answer: "Yes, you can retake our tests multiple times. We recommend waiting at least 30 days between attempts to ensure accurate results."
    },
    {
      question: "How long does the test take?",
      answer: "Our standard IQ test takes approximately 30 minutes to complete. Practice tests vary in length from 15-45 minutes depending on the category."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and never share your personal information with third parties. Your privacy is our top priority."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee on all paid subscriptions. If you're not satisfied, we'll refund your payment."
    },
    {
      question: "Can I download my results?",
      answer: "Yes, you can download your test results and certificates in PDF format. This feature is available for all paid plans."
    }
  ];

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
          }`}>
            Contact & Support
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're here to help! Get in touch with our support team for any questions or assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`rounded-2xl shadow-xl p-8 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
              : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
            }`}>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                }`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-bold py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className={`rounded-2xl shadow-xl p-8 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
              }`}>Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                      }`}>{info.title}</h3>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{info.description}</p>
                      <p className="font-semibold text-[#3498db]">{info.contact}</p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{info.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className={`rounded-2xl shadow-xl p-8 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
              }`}>Office Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Monday - Friday</span>
                  <span className={`font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>9:00 AM - 5:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Saturday</span>
                  <span className={`font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Sunday</span>
                  <span className={`font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
          }`}>
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className={`rounded-xl shadow-lg p-6 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>{faq.question}</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContactPage; 