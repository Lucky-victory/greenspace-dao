import * as React from "react";

interface EmailTemplateProps {
  name?: string;
  email: string;
  message?: string;
  link?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
  link,
}) => (
  <div style={{ maxWidth: "500px", margin: "1rem auto", padding: "0.5rem" }}>
    <h2 style={{ marginBottom: "0.5rem" }}>Nutritionist Application</h2>
    <p>Hi, {name}</p>
    <p>
      Thanks for applying as a Nutritionist on <b>GreenspaceDAO</b>,<br /> Your
      application was successful.
    </p>
    <p>
      We will reach out to you soon once the verification process is complete.
    </p>

    <div style={{ margin: "16px 0" }}>
      <p>
        Haven&apos;t heard from us?, You can also
        <a
          href={"https://greenspacedao.xyz/nutritionist/check-status/"}
          target="_blank"
          style={{
            display: "inline-block",

            color: "blue",

            fontWeight: 500,
          }}
        >
          check your application status.
        </a>
      </p>
    </div>

    <div style={{ margin: "1rem 0" }}>
      <span>Best Regards,</span>
      <div
        style={{
          marginTop: "0.875rem",
        }}
      >
        <b>Lucky victory</b>
        <br />
        <em>Co-founder</em>
      </div>
    </div>
  </div>
);
