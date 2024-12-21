import React from "react";

function CallToAction() {
  return (
    <section className="py-12 bg-blue-600 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Contribution Journey Today!
        </h2>
        <p className="text-lg mb-8">
          Sign up, explore issues, and make your first contribution now.
        </p>
        <a
          href="/auth/github"
          className="bg-white text-blue-600 px-6 py-3 rounded-md shadow hover:bg-gray-200 transition"
        >
          Login with GitHub
        </a>
      </div>
    </section>
  );
}

export default CallToAction;
