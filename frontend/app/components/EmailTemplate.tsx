import * as React from "react";

interface EmailTemplateProps {
  name?: string;
  email: string;
  message?: string;
  link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
  link,
}) => (
  <div style={{ maxWidth: "500px", margin: "1rem auto", padding: "0.5rem" }}>
    <h2 style={{ marginBottom: "0.5rem" }}>Meeting Invite</h2>
    <p>You were invited to join a meeting</p>

    <div>
      <a
        href={link}
        target="_black"
        style={{
          display: "inline-block",
          margin: "auto",
          textDecoration: "none",
          backgroundColor: "teal",
          color: "white",
          borderRadius: "12px",
          padding: "16px 8px",
          fontWeight: 500,
          fontSize: "18px",
        }}
      >
        Join meeting
      </a>
    </div>

    <div style={{ margin: "1rem 0" }}>
      <em>This is an automated reply.</em>
    </div>
  </div>
);
