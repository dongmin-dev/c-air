import React from "react";
import { FaGithub } from "react-icons/fa"; // Import the GitHub icon from the library
import "./FloatingGitHubLink.css"; // We will create this next

const FloatingGitHubLink = () => {
  return (
    <a
      href="https://github.com/dongmin-dev/c-air"
      target="_blank"
      rel="noopener noreferrer"
      className="github-link"
      title="View source on GitHub"
    >
      <FaGithub />
    </a>
  );
};

export default FloatingGitHubLink;
