/** @jsxImportSource react */

// —————————————————————————————————————————————————————————————————————————————
// Component

/**
 * For resetting a user's password.
 * - Outputs ugly email HTML/CSS & displays a button to reset password.
 */
export default function EmailResetPassword({ url }: { url: string }) {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#333" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
        <h1 style={{ color: "#2563eb", marginBottom: "18px", fontSize: "24px" }}>
          Reset Password
        </h1>
        <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "25px" }}>
          Click the button below to reset your password.
        </p>
        <a
          href={url}
          style={{
            display: "inline-block",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 30px",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            margin: "20px 0"
          }}
        >
          Reset my password
        </a>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "25px" }}>
          If you weren't trying to reset your password then this email should be deleted.
        </p>
      </div>
    </div>
  )
}
