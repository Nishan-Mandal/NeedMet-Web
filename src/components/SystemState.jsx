import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/SystemState.css";
import { Link } from "react-router-dom";
import NoDataImg from "../assets/no_data.png"

export default function SystemState({
  imageSrc,
  title = "No Listings",
  highlight = "Found",
  message = "Be the first to contribute by adding a store or service related to this category!",
  actionType,
  actionLabel = "+ Contribute Now",
  actionTo = "/",
}) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(actionTo);
  }

  const refreshPage = () => {
    navigate(0);
  }

  let onclickHandle = refreshPage;
  if(actionType === "refresh") {
    onclickHandle = refreshPage;
  } else if(actionType === "navigate") {
    onclickHandle = handleNavigate;
  }

  return (
    <div className="nodata-page">
      <div className="grid-overlay" />

      <div className="nodata-left">
        <img src={imageSrc} alt="image" />
      </div>

      <div className="nodata-right">
        <h1 className="title">
          {title} <span className="title-gradient">{highlight}</span>
        </h1>

        <p className="message">{message}</p>

        <div className="actions">
          <button onClick={onclickHandle} className="btn btn-primary">
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineNoListingsFound({ onContribute }) {
  return (
    <div className="no-listings-row">
      <div className="no-listings-img">
        <img src={NoDataImg} alt="no_data"/>
      </div>
 
      <div className="no-listings-text">
        <span className="no-listings-heading">No Listings Found</span>
        <span className="no-listings-sub">Be the first to contribute by adding a store or service related to this category!</span>
      </div>
 
      <button className="no-listings-btn" onClick={onContribute}>
        + Contribute Now
      </button>
    </div>
  );
}

export { InlineNoListingsFound };