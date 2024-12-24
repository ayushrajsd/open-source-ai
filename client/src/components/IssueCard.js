import React from "react";
import { Card, Tag, Button } from "antd";

function IssueCard({ issue, onSave, isSaved }) {
  const {
    title,
    repository,
    created_at,
    labels,
    stars,
    forks,
    summary,
    difficulty, // Difficulty level
  } = issue;

  // Map difficulty to color
  const difficultyColors = {
    Easy: "green",
    Medium: "gold",
    Challenging: "red",
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
        <div>
          <span className="font-semibold">Repository:</span> {repository}
        </div>
        <div>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(created_at).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Labels:</span>{" "}
          {labels?.length ? labels.join(", ") : "No labels available"}
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
      <div className="text-sm mt-4">
        <span className="font-semibold">Summary:</span> {summary || "N/A"}
      </div>
      <Button
        type="primary"
        onClick={onSave}
        className="mt-4 w-full"
        style={{ backgroundColor: isSaved ? "#52c41a" : "#1890ff" }}
      >
        {isSaved ? "Saved" : "Save Issue"}
      </Button>
    </Card>
  );
}

export default IssueCard;
