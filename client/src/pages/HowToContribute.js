/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { Link } from "react-router-dom";

function HowToContribute() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        How to Contribute
      </h1>

      {/* Introduction Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          What is Open Source?
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Open source refers to software projects that are publicly available,
          allowing anyone to view, use, modify, and distribute the code. It’s a
          great way to learn, collaborate, and give back to the tech community.
        </p>
      </section>

      {/* Step-by-Step Guide */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Fixing Your First Issue
        </h2>
        <ol className="list-decimal ml-6 text-gray-700 dark:text-gray-300 space-y-4">
          <li>
            <strong>Find an Issue:</strong> Use this app to explore
            beginner-friendly issues. Look for issues labeled <code>Easy</code>{" "}
            or <code>good first issue</code> or <code>help wanted</code>.
          </li>
          <li>
            <strong>Fork the Repository:</strong> Click the <code>Fork</code>{" "}
            button on GitHub to create your own copy of the repository.
            <p className="text-sm mt-2">
              Learn more:{" "}
              <a
                href="https://docs.github.com/en/get-started/quickstart/fork-a-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                How to Fork a Repository
              </a>
            </p>
          </li>
          <li>
            <strong>Clone the Repository:</strong> Clone the forked repository
            to your local machine using the following command:
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
              git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
            </pre>
            <p className="text-sm mt-2">
              Learn more:{" "}
              <a
                href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                How to Clone a Repository
              </a>
            </p>
          </li>
          <li>
            <strong>Read the Issue:</strong> Understand the issue you are
            solving by reading the issue description and replicating the
            problem.
          </li>
          <li>
            <strong>Create a Branch:</strong> Create a new branch for your work:
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
              git checkout -b fix-issue-123
            </pre>
            <p className="text-sm mt-2">
              Learn more:{" "}
              <a
                href="https://www.atlassian.com/git/tutorials/using-branches"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Working with Git Branches
              </a>
            </p>
          </li>
          <li>
            <strong>Fix the Issue:</strong> Make the necessary changes to the
            codebase to resolve the issue. Test your changes locally to ensure
            everything works.
          </li>
          <li>
            <strong>Commit Your Changes:</strong> Commit your changes with a
            clear and concise commit message:
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
              git commit -m "Fix: [describe what you fixed]"
            </pre>
          </li>
          <li>
            <strong>Push Your Changes:</strong> Push your branch to your forked
            repository:
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
              git push origin fix-issue-123
            </pre>
          </li>
          <li>
            <strong>Create a Pull Request:</strong> On GitHub, navigate to your
            forked repository and click <code>New Pull Request</code>.
            <p className="text-sm mt-2">
              Learn more:{" "}
              <a
                href="https://opensource.com/article/19/7/create-pull-request-github"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                How to Create a Pull Request
              </a>
            </p>
          </li>
          <li>
            <strong>Engage with the Maintainers:</strong> Be responsive to any
            feedback or requested changes from the project maintainers.
          </li>
        </ol>
      </section>

      {/* Best Practices */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Best Practices
        </h2>
        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>Write clear and concise commit messages.</li>
          <li>Follow the repository’s contribution guidelines.</li>
          <li>Test your code thoroughly before submitting a pull request.</li>
          <li>Be respectful and open to feedback from maintainers.</li>
        </ul>
      </section>

      {/* Tools and Resources */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Tools and Resources
        </h2>
        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            <a
              href="https://opensource.guide/how-to-contribute/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              How to Contribute to Open Source
            </a>
          </li>
          <li>
            <a
              href="https://git-scm.com/book/en/v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Pro Git Book
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub Documentation
            </a>
          </li>
        </ul>
      </section>

      {/* Back to Dashboard */}
      <div className="mt-6">
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default HowToContribute;
