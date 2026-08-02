import { useState, useEffect } from "react";
import useSalesStore from "../assets/store/Sales/SalesStore";
// import useGMStore from "../assets/Zustand/GM/GMStore";
import useMenuAuth from "../pages/Mutations/MenuMutations/MenuAuth";

export function useCodingActions() {
  const setPopupActionType = useSalesStore((state) => state.setPopupActionType);
  // const GMView = useSalesStore((state) => state.GMView);
  const codingPageType = useSalesStore((state) => state.codingPageType);

  const setAgentPopup = useSalesStore((state) => state.setAgentPopup);
  const setOperatorPopup = useSalesStore((state) => state.setOperatorPopup);
  const setBillToPopup = useSalesStore((state) => state.setBillToPopup);
  const setACPopup = useSalesStore((state) => state.setACPopup);
  const setFoodSupplierPopup = useSalesStore(
    (state) => state.setFoodSupplierPopup,
  );
  const setFlightNumberPopup = useSalesStore(
    (state) => state.setFlightNumberPopup,
  );
  const setRegistrationPopup = useSalesStore(
    (state) => state.setRegistrationPopup,
  );
  const setClientPopup = useSalesStore((state) => state.setClientPopup);
  const setUpdateClientPopup = useSalesStore(
    (state) => state.setUpdateClientPopup,
  );
  const setFoodItemPopup = useSalesStore((state) => state.setFoodItemPopup);
  const setGrandGroupPopup = useSalesStore((state) => state.setGrandGroupPopup);
  const setGroupPopup = useSalesStore((state) => state.setGroupPopup);
  const setSubGroupPopup = useSalesStore((state) => state.setSubGroupPopup);
  const setUnitPopup = useSalesStore((state) => state.setUnitPopup);
  const setAddOnPopup = useSalesStore((state) => state.setAddOnPopup);
  const setAddOnGroupPopup = useSalesStore((state) => state.setAddOnGroupPopup);
  const setAddOnPoup = useSalesStore((state) => state.setAddOnPoup);

  const setSelectedCodingItem = useSalesStore(
    (state) => state.setSelectedCodingItem,
  );

  const [isView, setIsView] = useState(false);
  const { menuItemActions3 } = useMenuAuth();

  useEffect(() => {
    if (menuItemActions3) {
      const flaggedData = menuItemActions3.filter(
        (action) => action.programActionButtonsFlag,
      );
      if (flaggedData?.length > 0) {
        flaggedData.forEach((action) => {
          if (
            action?.programActionButtonsActionName
              ?.toLowerCase()
              .includes("view")
          ) {
            setIsView(true);
          }
        });
      }
    }
  }, [menuItemActions3]);

  // Generic handler for "Edit" action
  // Can be used for double click or explicit edit button
  function handleEditAction(item) {
    // If item is provided, select it first
    if (item) {
      setSelectedCodingItem(item);
    }

    setPopupActionType("edit");

    switch (codingPageType) {
      case "Agent":
        setAgentPopup(true);
        break;
      case "Operator":
        setOperatorPopup(true);
        break;
      case "Bill To":
        setBillToPopup(true);
        break;
      case "Air Craft":
        setACPopup(true);
        break;
      case "Food Supplier":
        setFoodSupplierPopup(true);
        break;
      case "Flight Number":
        setFlightNumberPopup(true);
        break;
      case "Registration":
        setRegistrationPopup(true);
        break;
      case "Client":
        setClientPopup(true);
        break;
      case "ClientOnline":
        setUpdateClientPopup(true);
        break;
      case "Food Item":
      case "online Food Item":
        setFoodItemPopup(true);
        break;
      case "Grand Group":
        setGrandGroupPopup(true);
        break;
      case "Group":
        setGroupPopup(true);
        break;
      case "Sub Group":
        setSubGroupPopup(true);
        break;
      case "Unit":
        setUnitPopup(true);
        break;
      case "Add-On":
        setAddOnPopup(true);
        break;
      case "AddsGroup":
        setAddOnGroupPopup(true);
        break;
    }
  }

  return {
    handleEditAction,
    isView,
  };
}
