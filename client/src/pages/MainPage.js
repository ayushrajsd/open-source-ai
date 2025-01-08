import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";

function MainPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/github"; // Replace with your backend URL
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <header
        className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-12 md:py-20"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Simplify Your Open Source Journey with AI
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              Explore beginner-friendly issues, get personalized suggestions,
              and contribute confidently.
            </p>
            <div className="mt-8">
              <Link>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: "#4f46e5",
                    borderColor: "#4f46e5",
                  }}
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:block">
            <img
              src={require("../assets/images/hero_ai.svg").default}
              alt="AI Assistant"
              className="w-96"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Open Source Buddy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition duration-300">
              <CheckCircleOutlined className="text-blue-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Assisted Suggestions
              </h3>
              <p className="text-gray-600">
                Get AI-powered issue summaries and code suggestions tailored for
                you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition duration-300">
              <CheckCircleOutlined className="text-blue-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Preferences</h3>
              <p className="text-gray-600">
                Customize your preferences to explore relevant issues
                seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition duration-300">
              <CheckCircleOutlined className="text-blue-500 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contribute Faster</h3>
              <p className="text-gray-600">
                Streamline your open-source journey with efficient tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Contributing Today
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Join developers worldwide and accelerate your open-source
            contributions.
          </p>
          <Button
            size="large"
            type="primary"
            icon={<ArrowRightOutlined />}
            style={{ backgroundColor: "#facc15", borderColor: "#facc15" }}
            className="text-blue-900 font-semibold shadow hover:shadow-lg"
            onClick={handleLogin}
          >
            Login with GitHub
          </Button>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
