/* client/src/views/Completion.jsx */
import React from "react";
import "../css/completion.css"; // Assuming you have a CSS file for styling
import { Link } from "react-router-dom";

const Completion = () => {
  return (
    <div className="completion-container">
      <h1>Thank You for Your Purchase!</h1>
      <p>
        Your payment for the premium service has been successfully processed.
      </p>
      <p>
        We appreciate your support and are excited to have you as a premium
        member.
      </p>
      <div className="completion-details">
        <h2>What's Next?</h2>
        <ul>
          <li>Access exclusive premium content.</li>
          <li>Enjoy ad-free browsing.</li>
          <li>Receive priority customer support.</li>
        </ul>
      </div>
      <Link className="go-to-dashboard" to="/home">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Completion;
