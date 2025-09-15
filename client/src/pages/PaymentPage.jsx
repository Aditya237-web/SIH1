// src/pages/PaymentPage.jsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect back if no booking info
  useEffect(() => {
    if (!state || !state.fare) {
      navigate('/');
    }
  }, [state, navigate]);

  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY', // replace with your test key
      amount: state.fare * 100, // in paise
      currency: 'INR',
      name: 'SmartBus Bharat',
      description: `${state.from} → ${state.to}`,
      handler: (response) => {
        generatePDF(response.razorpay_payment_id);
      },
      prefill: {
        name: state.name
      },
      theme: { color: '#228B22' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const generatePDF = (paymentId) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SmartBus Bharat – Ticket', 20, 20);
    doc.setFontSize(12);
    doc.text(`Passenger: ${state.name}`, 20, 40);
    doc.text(`Route: ${state.from} → ${state.to}`, 20, 50);
    doc.text(`Fare: ₹${state.fare}`, 20, 60);
    doc.text(`Payment ID: ${paymentId}`, 20, 70);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 80);
    doc.save(`ticket_${paymentId}.pdf`);

    // After download, redirect home or to a success screen
    navigate('/');
  };

  return (
    <main style={{
      maxWidth: '600px', margin: '4rem auto', textAlign: 'center',
      fontFamily: 'Noto Sans, sans-serif'
    }}>
      <h2 style={{ color: '#002147' }}>💳 Complete Payment</h2>
      <p>Route: {state.from} → {state.to}</p>
      <p>Fare: <strong>₹{state.fare}</strong></p>
      <button
        onClick={handlePayment}
        style={{
          marginTop: '2rem', padding: '0.75rem 1.5rem',
          backgroundColor: '#228B22', color: 'white',
          border: 'none', borderRadius: '4px', cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Pay ₹{state.fare}
      </button>
    </main>
  );
}

export default PaymentPage;