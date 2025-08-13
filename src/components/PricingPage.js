import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PricingPage = ({ onSubscribe }) => {
  const { isDarkMode } = useTheme();
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "1 IQ Test",
        "Basic Results",
        "Community Access",
        "Email Support"
      ],
      popular: false,
      buttonText: "Start Free",
      buttonColor: "from-gray-400 to-gray-600"
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      features: [
        "Unlimited IQ Tests",
        "Detailed Analysis",
        "Progress Tracking",
        "Practice Tests",
        "Priority Support",
        "Certificate Download"
      ],
      popular: true,
      buttonText: "Get Pro",
      buttonColor: "from-[#3498db] to-[#8e44ad]"
    },
    {
      name: "Premium",
      price: "$49",
      period: "month",
      features: [
        "Everything in Pro",
        "Advanced Analytics",
        "Personal Coach",
        "Custom Tests",
        "API Access",
        "White-label Solutions"
      ],
      popular: false,
      buttonText: "Get Premium",
      buttonColor: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className={`py-16 min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
          }`}>
            Choose Your Plan
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Select the perfect plan to unlock your cognitive potential and track your intellectual growth.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl shadow-xl p-8 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              } ${
                plan.popular ? 'ring-4 ring-[#3498db] ring-opacity-50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-[#3498db]">{plan.price}</span>
                  <span className={`ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSubscribe(plan.name)}
                className={`w-full bg-gradient-to-r ${plan.buttonColor} text-white font-bold py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#34495e] mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-[#34495e] mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time with no questions asked.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-[#34495e] mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-[#34495e] mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans come with a 7-day free trial period.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-[#34495e] mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee on all subscriptions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 