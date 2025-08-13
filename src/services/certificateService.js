// Certificate Service for generating premium PDF certificates

import jsPDF from 'jspdf';

class CertificateService {
  constructor() {
    this.generateAuthNumber = this.generateAuthNumber.bind(this);
    this.generateCertificate = this.generateCertificate.bind(this);
  }

  // Generate unique authentication number
  generateAuthNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    const authNumber = `IQScalar-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
    return authNumber;
  }

  // Get performance level based on percentage
  getPerformanceLevel(percentage) {
    if (percentage >= 95) return { level: "Exceptional", color: "#059669" };
    if (percentage >= 90) return { level: "Outstanding", color: "#059669" };
    if (percentage >= 85) return { level: "Excellent", color: "#0891b2" };
    if (percentage >= 80) return { level: "Above Average", color: "#0891b2" };
    if (percentage >= 75) return { level: "Good", color: "#d97706" };
    if (percentage >= 70) return { level: "Average", color: "#d97706" };
    if (percentage >= 60) return { level: "Below Average", color: "#dc2626" };
    return { level: "Needs Improvement", color: "#dc2626" };
  }

  // Calculate IQ score
  calculateIQScore(percentage) {
    return Math.round(Math.max(70, Math.min(145, 55 + percentage * 0.9)));
  }

  // Generate premium PDF certificate
  generateCertificate(userData, testResults) {
    return new Promise((resolve, reject) => {
      try {
        const authNumber = this.generateAuthNumber();
        const iqScore = testResults.iqScore || this.calculateIQScore(testResults.percentage);
        const performance = this.getPerformanceLevel(testResults.percentage);
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Create PDF document
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set up fonts and colors
        doc.setFont('helvetica');
        
        // Draw background
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Draw decorative border
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(3);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Inner border
        doc.setDrawColor(142, 68, 173);
        doc.setLineWidth(1);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Header section
        doc.setFillColor(52, 152, 219);
        doc.rect(20, 20, pageWidth - 40, 40, 'F');

        // IQScalar Logo/Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('IQScalar', pageWidth / 2, 35, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Cognitive Assessment & Intelligence Testing Platform', pageWidth / 2, 48, { align: 'center' });

        // Main certificate content
        doc.setTextColor(52, 73, 94);
        
        // Certificate title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 80, { align: 'center' });

        // This is to certify that
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('This is to certify that', pageWidth / 2, 100, { align: 'center' });

        // Student name
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 152, 219);
        doc.text(userData.fullName.toUpperCase(), pageWidth / 2, 115, { align: 'center' });

        // Age
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(52, 73, 94);
        doc.text(`Age: ${userData.age} years`, pageWidth / 2, 125, { align: 'center' });

        // Has successfully completed
        doc.text('has successfully completed the IQScalar Intelligence Quotient Assessment', pageWidth / 2, 140, { align: 'center' });

        // Test results section
        const resultsY = 160;
        
        // IQ Score
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 152, 219);
        doc.text(`IQ Score: ${iqScore}`, pageWidth / 2, resultsY, { align: 'center' });

        // Performance level
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(performance.color);
        doc.text(`Performance Level: ${performance.level}`, pageWidth / 2, resultsY + 15, { align: 'center' });

        // Test details
        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text(`Test Score: ${testResults.score}/${testResults.totalQuestions} (${testResults.percentage.toFixed(1)}%)`, pageWidth / 2, resultsY + 30, { align: 'center' });

        // Date
        doc.text(`Date of Assessment: ${currentDate}`, pageWidth / 2, resultsY + 45, { align: 'center' });

        // Authentication section
        const authY = resultsY + 70;
        
        // Authentication number
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(142, 68, 173);
        doc.text('Authentication Number:', pageWidth / 2, authY, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(authNumber, pageWidth / 2, authY + 8, { align: 'center' });

        // Verification note
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(108, 117, 125);
        doc.text('This certificate can be verified at: https://IQScalar.com/verify', pageWidth / 2, authY + 20, { align: 'center' });

        // Footer section
        const footerY = pageHeight - 40;
        
        // Signature line
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 60, footerY, pageWidth / 2 + 60, footerY);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 73, 94);
        doc.text('IQScalar Assessment Team', pageWidth / 2, footerY + 10, { align: 'center' });

        // Decorative elements
        // Corner decorations
        doc.setFillColor(52, 152, 219);
        doc.circle(30, 30, 8, 'F');
        doc.circle(pageWidth - 30, 30, 8, 'F');
        doc.circle(30, pageHeight - 30, 8, 'F');
        doc.circle(pageWidth - 30, pageHeight - 30, 8, 'F');

        // Center decoration
        doc.setFillColor(142, 68, 173);
        doc.circle(pageWidth / 2, pageHeight / 2, 3, 'F');

        // Generate filename
        const sanitizedName = userData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `IQScalar_Certificate_${sanitizedName}_${Date.now()}.pdf`;

        // Save the PDF
        doc.save(filename);

        resolve({ filename });

      } catch (error) {
        console.error('Error generating certificate:', error);
        reject(error);
      }
    });
  }

  // Generate certificate as image (alternative method)
  generateCertificateImage(userData, testResults) {
    return new Promise((resolve, reject) => {
      try {
        const authNumber = this.generateAuthNumber();
        const iqScore = testResults.iqScore || this.calculateIQScore(testResults.percentage);
        const performance = this.getPerformanceLevel(testResults.percentage);
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1123;
        canvas.height = 794;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(0.5, '#f1f5f9');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        ctx.strokeStyle = '#8e44ad';
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

        const headerGradient = ctx.createLinearGradient(0, 40, 0, 120);
        headerGradient.addColorStop(0, '#3498db');
        headerGradient.addColorStop(1, '#2980b9');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(40, 40, canvas.width - 80, 80);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IQScalar', canvas.width / 2, 85);
        ctx.font = '20px Arial';
        ctx.fillText('Cognitive Assessment & Intelligence Testing Platform', canvas.width / 2, 110);

        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 160);
        ctx.font = '20px Arial';
        ctx.fillText('This is to certify that', canvas.width / 2, 190);

        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(userData.fullName.toUpperCase(), canvas.width / 2, 225);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '18px Arial';
        ctx.fillText(`Age: ${userData.age} years`, canvas.width / 2, 250);
        ctx.fillText('has successfully completed the IQScalar Intelligence Quotient Assessment', canvas.width / 2, 275);

        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`IQ Score: ${iqScore}`, canvas.width / 2, 310);

        ctx.fillStyle = performance.color;
        ctx.font = '22px Arial';
        ctx.fillText(`Performance Level: ${performance.level}`, canvas.width / 2, 340);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '18px Arial';
        ctx.fillText(`Test Score: ${testResults.score}/${testResults.totalQuestions} (${testResults.percentage.toFixed(1)}%)`, canvas.width / 2, 370);
        ctx.fillText(`Date of Assessment: ${currentDate}`, canvas.width / 2, 395);

        ctx.fillStyle = '#8e44ad';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Authentication Number:', canvas.width / 2, 440);
        ctx.font = '18px Arial';
        ctx.fillText(authNumber, canvas.width / 2, 460);

        ctx.fillStyle = '#6c757d';
        ctx.font = '14px Arial';
        ctx.fillText('This certificate can be verified at: https://IQScalar.com/verify', canvas.width / 2, 485);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 120, canvas.height - 80);
        ctx.lineTo(canvas.width / 2 + 120, canvas.height - 80);
        ctx.stroke();

        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('IQScalar Assessment Team', canvas.width / 2, canvas.height - 60);

        canvas.toBlob((blob) => {
          const sanitizedName = userData.fullName.replace(/[^a-zA-Z0-9]/g, '_');
          const filename = `IQScalar_Certificate_${sanitizedName}_${Date.now()}.png`;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
          resolve({ filename });
        }, 'image/png');

      } catch (error) {
        console.error('Error generating certificate image:', error);
        reject(error);
      }
    });
  }
}

const certificateService = new CertificateService();

export default certificateService; 