// src/components/IssueDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, List, Divider, Spin, Alert, Button } from "antd";
import { getIssueDetails, generateDebuggingTips } from "../api/issues";

const { Title, Paragraph, Text } = Typography;

const IssueDetail = () => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugTips, setDebugTips] = useState("");
  const { issueNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const repositoryUrl = queryParams.get("repository");

    // Fetch the issue details from the backend
    const fetchIssueDetails = async () => {
      try {
        const data = await getIssueDetails(issueNumber, repositoryUrl);
        setIssue(data);

        // Fetch debugging tips
        const tipsResponse = await generateDebuggingTips(
          issueNumber,
          repositoryUrl
        );
        setDebugTips(tipsResponse.tips);
      } catch (error) {
        console.error("Error fetching issue details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [issueNumber, location.search]);

  if (loading) {
    return <Spin tip="Loading issue details..." />;
  }

  if (!issue) {
    return <Alert message="Issue not found" type="error" />;
  }

  // Prepare step-by-step instructions
  const steps = [
    {
      id: 1,
      title: "Clone the Repository",
      description: `git clone ${issue.url.replace(/\/issues\/\d+$/, ".git")}`,
    },
    {
      id: 2,
      title: "Set Up Environment",
      description:
        "Run `npm install` to install dependencies. Check the README for additional setup instructions.",
    },
    { id: 3, title: "Understand the Issue", description: issue.summary },
    {
      id: 4,
      title: "Debugging Tips",
      description:
        debugTips ||
        "Start by reproducing the issue locally. Add debug logs to identify the root cause.",
    },
    {
      id: 5,
      title: "Write the Fix",
      description:
        "Follow coding standards. Write clean, modular code, and include comments explaining your changes.",
    },
    {
      id: 6,
      title: "Test the Fix",
      description:
        "Run the test suite using `npm test`. If no tests exist, add new ones to cover your fix.",
    },
    {
      id: 7,
      title: "Create a Pull Request",
      description:
        "Submit your changes via a PR. Follow the contribution guidelines and add a detailed description.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Button type="default" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button
          type="primary"
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on GitHub
        </Button>
      </div>

      {/* Issue Details Card */}
      <Card className="max-w-3xl mx-auto p-6 shadow-md">
        <Title level={3} className="text-blue-600">
          {issue.title}
        </Title>
        <Paragraph>
          <Text strong>Repository:</Text> {issue.repository}
        </Paragraph>
        <Paragraph>
          <Text strong>Created At:</Text>{" "}
          {new Date(issue.created_at).toLocaleDateString()}
        </Paragraph>
        <Divider />

        {/* Step-by-Step Plan */}
        <Title level={4}>Step-by-Step Plan</Title>
        <List
          itemLayout="vertical"
          dataSource={steps}
          renderItem={(step) => (
            <List.Item>
              <Title level={5}>{step.title}</Title>
              <Paragraph>{step.description}</Paragraph>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default IssueDetail;
