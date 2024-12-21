import React from "react";

function Login() {
  const handleLogin = () => {
    // Redirect to the GitHub OAuth endpoint in your backend
    window.location.href = "http://localhost:8000/auth/github"; // Replace with your backend URL
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-500">
          Open Source Buddy
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Connect your GitHub account to start your open source journey.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow transition"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
