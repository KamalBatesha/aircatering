// import "../../Pages/HR/Pages/Employees/Employees.css";

// import { set } from "date-fns";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// import useEmployeesStore from "../../../assets/store/HR/EmployeesStore";
import useUIStore from "../../assets/store/UI/UIState";
import useEmployeesStore from "../../assets/store/HR/EmployeesStore";

function InnerNav({
  list = [],
  current = null,
  setCurrent,
  idName,
  refresh,
  backTo,
  delay = 0,
  setSelectedPurDetailsItem,
}) {
  const [disabled, setDisabled] = useState(false);
  const setIsBackButton = useEmployeesStore((state) => state.setIsBackButton);

  // Check if everything needed is available
  const setShowAbsoluteHeader = useUIStore(
    (state) => state.setShowAbsoluteHeader
  );
  const navigate = useNavigate();
  const isReady = Array.isArray(list) && list.length > 0 && current && idName;

  const currentIndex = isReady
    ? list.findIndex((item) => item[idName] === current[idName])
    : -1;

  const handleRefresh = (newId) => {
    if (!refresh) return;
    const baseUrl = window.location.pathname.split("/").slice(0, -1).join("/");
    navigate(`${baseUrl}/${newId}`);
  };

  const handleNext = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
      if (!isReady || currentIndex === -1 || currentIndex >= list.length - 1)
        return;

      const newItem = list[currentIndex + 1];
      setCurrent(newItem);
      if (setSelectedPurDetailsItem) setSelectedPurDetailsItem(null);
      handleRefresh(newItem[idName]);
      document.getElementById(newItem[idName])?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setShowAbsoluteHeader(false);
    }, delay);
  };

  const handlePrev = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
      if (!isReady || currentIndex <= 0) return;

      const newItem = list[currentIndex - 1];
      setCurrent(newItem);
      if (setSelectedPurDetailsItem) setSelectedPurDetailsItem(null);
      handleRefresh(newItem[idName]);

      document.getElementById(newItem[idName])?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setShowAbsoluteHeader(false);
    }, delay);
  };

  function handleBack() {
    setIsBackButton(true);
    navigate(backTo);
  }

  return (
    <div
      className="employee-nav-btns"
      style={{ height: "fit-content", display: "flex", alignItems: "center" }}
    >
      {backTo && (
        <div>
          <button
            className="glb-btn"
            style={{ height: "fit-content", marginRight: "10px" }}
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      )}
      <div
        className="emp-nav-btn left"
        title="Previous"
        onClick={handlePrev}
        style={{
          opacity: disabled || !isReady || currentIndex <= 0 ? 0.5 : 1,
          pointerEvents:
            disabled || !isReady || currentIndex <= 0 ? "none" : "auto",
          height: "fit-content",
        }}
      >
        <FaArrowLeft size={14} />
      </div>
      <div
        className="emp-nav-btn right"
        title="Next"
        onClick={handleNext}
        style={{
          opacity:
            disabled ||
              !isReady ||
              currentIndex === -1 ||
              currentIndex >= list.length - 1
              ? 0.5
              : 1,
          pointerEvents:
            disabled ||
              !isReady ||
              currentIndex === -1 ||
              currentIndex >= list.length - 1
              ? "none"
              : "auto",
          height: "fit-content",
        }}
      >
        <FaArrowRight size={14} />
      </div>
    </div>
  );
}

export default InnerNav;
