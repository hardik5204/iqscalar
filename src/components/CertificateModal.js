import React, { useState } from 'react';

const CertificateModal = ({ isOpen, onClose, onGenerateCertificate, testResults }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.age.trim()) {
      alert('Please fill in your name and age to generate the certificate.');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateCertificate(formData);
      onClose();
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('There was an error generating your certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-premium-glow">
            🏆
          </div>
          <h2 className="font-display text-2xl font-bold text-[#34495e] mb-2">
            Generate Your Certificate
          </h2>
          <p className="font-premium text-gray-600">
            Complete your details to receive your official IQScalar IQ certificate
          </p>
        </div>

        {/* Test Results Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
          <h3 className="font-premium font-semibold text-[#34495e] mb-2">Test Results Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-premium text-gray-600">Score:</span>
              <span className="font-display font-bold text-[#3498db] ml-2">{testResults.score}/{testResults.totalQuestions}</span>
            </div>
            <div>
              <span className="font-premium text-gray-600">Percentage:</span>
              <span className="font-display font-bold text-[#8e44ad] ml-2">{testResults.percentage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-premium text-gray-600">IQ Score:</span>
              <span className="font-display font-bold text-green-600 ml-2">
                {testResults.iqScore || Math.round(Math.max(70, Math.min(145, 55 + testResults.percentage * 0.9)))}
              </span>
            </div>
            <div>
              <span className="font-premium text-gray-600">Date:</span>
              <span className="font-premium text-gray-700 ml-2">
                {new Date(testResults.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block font-premium font-medium text-[#34495e] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-300 font-premium"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block font-premium font-medium text-[#34495e] mb-2">
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-300 font-premium"
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-premium font-medium text-[#34495e] mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-all duration-300 font-premium"
              placeholder="Enter your email address"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-premium font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white px-6 py-3 rounded-2xl font-premium font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-premium-loading w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Certificate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateModal; 