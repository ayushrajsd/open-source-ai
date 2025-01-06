import React from "react";
import { Card, Tag, Button } from "antd";
import { Link } from "react-router-dom";

function IssueCard({ issue, onSave, isSaved }) {
  const {
    title,
    repository,
    created_at,
    labels,
    stars,
    forks,
    summary,
    difficulty,
  } = issue;

  // Map difficulty to color
  const difficultyColors = {
    Easy: "green",
    Medium: "gold",
    Challenging: "red",
  };

  // Generate tags for labels
  const renderLabels = () =>
    labels?.length
      ? labels.map((label, index) => (
          <Tag key={index} color="blue" className="mr-1 mb-1">
            {label}
          </Tag>
        ))
      : "No labels available";

  return (
    <Card
      className="w-full max-w-2xl mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow rounded-lg"
      hoverable
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        {title}
      </h3>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
        <div>
          <span className="font-semibold">Repository:</span> {repository}
        </div>
        <div>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(created_at).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Labels:</span> {renderLabels()}
        </div>
        <div>
          <span className="font-semibold">Stars:</span> {stars}
        </div>
        <div>
          <span className="font-semibold">Forks:</span> {forks}
        </div>
        <div>
          <span className="font-semibold">Difficulty:</span>{" "}
          <Tag color={difficultyColors[difficulty]}>{difficulty}</Tag>
        </div>
      </div>

      {/* Summary Section */}
      <div className="text-sm mt-4 p-4 bg-gray-50 border-l-4 border-blue-500 rounded-md shadow-sm">
        <span className="font-semibold block mb-2">Summary:</span>
        <p className="text-gray-700">{summary || "N/A"}</p>
        <p>{issue.repository}</p>
        <h3 className="mt-4">
          <Link
            to={`/issues/${issue.number}?repository=${encodeURIComponent(
              issue.repository
            )}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition duration-200 focus:ring-2 focus:ring-blue-300"
          >
            <span>View Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </h3>
      </div>

      {/* Save Button */}
      <Button
        type="primary"
        onClick={onSave}
        className="mt-4 w-full"
        style={{
          backgroundColor: isSaved ? "#52c41a" : "#1890ff",
          borderColor: isSaved ? "#52c41a" : "#1890ff",
        }}
        size="large"
      >
        {isSaved ? "Saved" : "Save Issue"}
      </Button>
    </Card>
  );
}

export default IssueCard;
