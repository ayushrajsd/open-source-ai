import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const features = [
  {
    id: 1,
    title: "Explore Issues",
    description: "Find beginner-friendly issues to contribute to.",
  },
  {
    id: 2,
    title: "Save Preferences",
    description: "Set your favorite programming languages and categories.",
  },
  {
    id: 3,
    title: "Contribute Easily",
    description: "Receive AI-assisted suggestions for contributions.",
  },
];

function FeatureHighlights() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-blue-500">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <CheckCircleOutlined className="text-blue-500 text-4xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureHighlights;
