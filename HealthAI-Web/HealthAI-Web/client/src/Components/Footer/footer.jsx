import React from "react";
import "./footer.css";

export default function App2() {
  return (
    <footer className="bottom">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-12">
            {/* Contact Us */}
            <div className="contact-section">
              <span style={{ display: "inline-block", marginTop: 5 }}>
                Contact Us
              </span>
              <ul>
                {/* Contact details */}
                <li>
                  <i className="fa fa-envelope"></i> jamie.roche1@mycit.ie
                </li>
                <li>
                  <i className="fa fa-phone"></i> +353 86 220 8215
                </li>
                <li>
                  <i className="fa fa-map-marker"></i> Bishopstown, Cork
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-4 col-12" style={{ marginTop: 10 }}>
            {/* Empty div */}
            <h4 style={{ color: "lightgrey" }}>&nbsp;</h4>
          </div>
          <div className="col-md-4 col-12" style={{ marginTop: 10 }}>
            {/* Terms & Policies */}
            <div className="terms-section">
              <h4 style={{ color: "lightgrey", textAlign: "justify" }}>
                Terms & Policies
              </h4>
              <nav className="Navfooter">
                <ul className="list-unstyled">
                  {/* Policy links */}
                  <li>
                    <a href="privacy-policy.html">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="terms-and-conditions.html">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="refund-policy.html">Refund Policy</a>
                  </li>
                  <li>
                    <a href="disclaimer-policy.html">Disclaimer Policy</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Copyright and social icons */}
          <div
            className="col-12"
            style={{
              fontSize: 14,
              color: "lightgrey",
              textAlign: "end",
            }}
          >
            &copy; {new Date().getFullYear()} ©HealthAI | All Rights Reserved
            <i
              className="fa fa-facebook-official"
              aria-hidden="true"
              style={{ padding: 10, color: "white" }}
            ></i>
            <i
              className="fa fa-twitter-square"
              aria-hidden="true"
              style={{ padding: 10, color: "white" }}
            ></i>
            <i
              className="fa fa-github-square"
              aria-hidden="true"
              style={{ padding: 10, color: "white" }}
            ></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
