import React from "react";

const LoadingOverlay = ({ title, subtitle }) => {
  return (
    <div style={overlayStyle}>
      <div style={loadingTextStyle}>
        <div style={spinnerStyle} className="spinner"></div>
        <span className="visually-hidden">Loading...</span>
        {title && <p>{title}</p>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

// Styles for the overlay
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

// Styles for the spinner
const spinnerStyle = {
  width: "3rem",
  height: "3rem",
  border: "4px solid rgba(255, 255, 255, 0.3)",
  borderTop: "4px solid white",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "20px", // Add some space between the spinner and the text
};

// Keyframes for the spinner animation
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Styles for the text
const loadingTextStyle = {
  textAlign: "center", // Center the text
  color: "white", // Text color
  fontSize: "1.2rem", // Adjust font size as needed
};

// Inject keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinnerKeyframes, styleSheet.cssRules.length);

export default LoadingOverlay;
