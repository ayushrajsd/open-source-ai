import React from "react";

function IssueCard({ issue, onSave, onRemove, isSaved }) {
  return (
    <li className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-medium text-blue-500 dark:text-blue-400">
        <a href={issue.url} target="_blank" rel="noopener noreferrer">
          {issue.title}
        </a>
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {issue.description}
      </p>
      <div className="mt-2 flex space-x-2">
        {/* Ensure tags exist before mapping */}
        {issue.tags && issue.tags.length > 0 ? (
          issue.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full dark:bg-blue-700 dark:text-blue-200"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            No tags available
          </span>
        )}
      </div>
      <div className="mt-4">
        {/* Save or Unsave Button */}
        {isSaved ? (
          <button
            onClick={onRemove}
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={onSave}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow transition"
          >
            Save Issue
          </button>
        )}
      </div>
    </li>
  );
}

export default IssueCard;
