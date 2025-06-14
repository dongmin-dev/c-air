import React from "react";
import { FaGithub } from "react-icons/fa";
import "./FloatingGitHubLink.css";

const FloatingGitHubLink = () => {
  return (
    <a
      href="https://github.com/dongmin-dev/c-air"
      target="_blank"
      rel="noopener noreferrer"
      className="github-link"
    >
      <FaGithub />
      {/* This span is our new custom tooltip */}
      <span className="tooltip-text">View Source on GitHub</span>
    </a>
  );
};

export default FloatingGitHubLink;
