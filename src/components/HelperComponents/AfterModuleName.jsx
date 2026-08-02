import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";

import useMenuStore from "../../assets/Zustand/MenuIems/MenuItems";
import useTransactionStore from "../../assets/Zustand/Transactions/TransactionsStore";
import useUIStore from "../../assets/Zustand/UI/UIState";
import Purchasing from "../../Pages/Purchasing/Purchasing";

function AfterModuleName({ module }) {
  const [lastSegment, setLastSegment] = useState(null);
  const [targetTier, setTargetTier] = useState(null);
  const selectedEmployee = useUIStore((state) => state.selectedEmployee);
  const selectedPurchasingItem = useUIStore(
    (state) => state.selectedPurchasingItem
  );
  const selectedEmployeeSchedule = useUIStore(
    (state) => state.selectedEmployeeSchedule
  );
  const selectedEmployeeTransaction = useTransactionStore(
    (state) => state.selectedEmployeeTransaction
  );
  const levelThreeActive = useMenuStore((state) => state.levelThreeActive);
  const levelTwoActive = useMenuStore((state) => state.levelTwoActive);

  console.log("levelThreeActives", levelThreeActive, levelTwoActive);
  const url = window.location.pathname;
  useEffect(() => {
    const segments = url.split("/");
    const lSegment = segments.pop() || segments.pop();
    console.log("lolo", lSegment);
    setLastSegment(lSegment);
  }, [url]);

  const obj = {
    HR: {
      172: {
        value: selectedEmployee?.personalName,
        show: lastSegment !== "EmployeeInformation",
      },
      152: {
        value: selectedEmployeeTransaction?.personalName,
        show: lastSegment !== "DailyTransaction",
      },
      177: {
        value: selectedEmployeeSchedule?.personalName,
        show: lastSegment !== "EmployeeSchedule",
      },
    },

    Purchasing: {
      193: {
        value: selectedPurchasingItem?.purReqNumber,
        show: lastSegment !== "ActionList",
      },
    },
  };
  useEffect(() => {
    const tier = module === "HR" ? levelThreeActive : levelTwoActive;
    setTargetTier(tier);
  }, [url]);
  return obj[module][targetTier]?.show && obj[module][targetTier]?.value ? (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FaAngleRight />
      <span>{obj[module][targetTier]?.value}</span>
    </span>
  ) : (
    ""
  );
}

export default AfterModuleName;
