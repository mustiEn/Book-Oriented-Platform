/* client/src/views/Completion.jsx */
import React, { useEffect } from "react";
import "../css/completion.css"; // Assuming you have a CSS file for styling
import { Link, useSearchParams } from "react-router";

const Completion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");
  console.log(sessionId);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/webhook?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      {success ? (
        <div className="completion-container">
          <h1>Thank You for Your Purchase!</h1>
          <p>
            Your payment for the premium service has been successfully
            processed.
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
          <Link className="btn btn-success" to="/home">
            Go Home
          </Link>
        </div>
      ) : (
        <div className="completion-container">
          <h1>Payment Canceled</h1>
          <p>
            Your payment process was canceled. If this was a mistake, you can
            try again.
          </p>
          <Link className="btn btn-warning" to="/premium">
            Retry Payment
          </Link>
        </div>
      )}
    </>
  );
};

export default Completion;
