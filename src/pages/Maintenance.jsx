import React from "react";
import "../style/Maintenance.css";
import maintenanceImg from "../assets/maintenance.jpg";
import { Link } from "react-router-dom";

export default function Maintenance() {
  return (
    <div className="maintenance-page">
      <div className="grid-overlay" />

      <div className="maintenance-left">
        <img src={maintenanceImg} alt="maintenance" />
      </div>

      <div className="maintenance-right">
        <h1 className="title">
          Feature in <span className="title-gradient">Progress</span>
        </h1>

        <p className="message">
          We're crafting something exceptional behind the scenes.
          This experience will be ready for you very soon.
        </p>

        <div className="actions">
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}