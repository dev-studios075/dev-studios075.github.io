
import React, { useState } from "react";
import { toast } from "sonner";

const DetailsSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle mobile number validation (only allow digits and limit to 10)
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitToGoogleSheet = async (data: typeof formData) => {
    // Replace this URL with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzV1GknhyAQxqs0k1MPXJVa7HThmQcAZU2N1E-Ca219cd3csRLX9DsjOgAcjuEtbvRqDQ/exec";
    
    const payload = {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      company: data.company,
      timestamp: new Date().toISOString()
    };

    try {
      console.log("Submitting data to Google Sheet:", payload);
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      // With no-cors mode, we can't check response status
      // So we assume success if no error is thrown
      return true;
    } catch (error) {
      console.error("Error submitting to Google Sheet:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.fullName || !formData.email || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Google Sheet
      await submitToGoogleSheet(formData);
      
      toast.success("Request submitted successfully! We'll get back to you soon.");

      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        company: ""
      });
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="details" className="w-full bg-white min-h-screen flex items-center justify-center py-0">
      <div className="container max-w-3xl flex items-center justify-center px-4 sm:px-6 lg:px-8 mx-auto min-h-[75vh]">
        <div className="w-full">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant bg-white">
            {/* Card Header with background image */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start" style={{
              backgroundImage: "url('/background-section1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
                Request a demo
              </div>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
                Our team will show you how we can transform your Logistic Operations in 20 minutes
              </h2>
            </div>

            {/* Card Content - Form */}
            <div className="bg-white p-4 sm:p-8" style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECEC"
            }}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number (10 digits)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-pulse-500 hover:bg-pulse-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors duration-300"
                  >
                    {isSubmitting ? "Submitting..." : "Request access"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
