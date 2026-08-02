// import useKDStore from "@/assets/Zustand/KD/KDStore";
// import useSalesStore from "@/assets/Zustand/Sales/SalesStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useSalesStore from "../assets/store/Sales/SalesStore";
import useKDStore from "../assets/store/KD/KDStore";
import KDMutations from "../assets/apis/KD/KDMutations";
import RunningOrders from "./ERP/RunningOrders/RunningOrders";
import { ConfirmationPopUp } from "./ERP/RunningOrders/OrderDetails";
// import {
//   GetKitchenIndvedualRunningOrderList,
//   GetKitchenOrderList,
//   GetQuotaionList,
// } from "../../../../../../assets/Api/Sales/SalesAPI";
// import { ConfirmationPopUp } from "../../../../../KitchenDepartments/Pages/RunningOrders/OrderDetails";
// import RunningOrders from "../../../../../KitchenDepartments/Pages/RunningOrders/RunningOrders";
// import RunningOrdersMutations from "../../../../../KitchenDepartments/Pages/RunningOrders/RunningOrdersMutations";
function TicketsDepatment({
  KD,
  depId,
  begDate,
  endDate,
  AllDep,
  individual
}) {
  const {
    data: fetchedData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["KDIndividualList", depId],
    queryFn: () => {
      return KD && individual
        ? GetKitchenIndvedualRunningOrderList(depId)
        : null

    },
    enabled: (!!begDate && !!endDate) || !!KD,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const [activeKey, setActiveKey] = useState(KD && !AllDep ? "current" : "all");
  const selectedQuotation = useSalesStore((state) => state.selectedQuotation);
  const holdPopUp = useKDStore((state) => state.holdPopUp);
  const setHoldPopUp = useKDStore((state) => state.setHoldPopUp);
  const donePopUp = useKDStore((state) => state.donePopUp);
  const setDonePopUp = useKDStore((state) => state.setDonePopUp);
  const { markItemAsHold, markItemDone } = KDMutations(
    depId,
    selectedQuotation?.orderHeaderId,
    activeKey
  );
  function handleHold() {
    markItemAsHold.mutate({ itemId: holdPopUp?.orderDetailsId });
    setHoldPopUp(false);
  }

  function handleDone() {
    markItemDone.mutate({ itemId: donePopUp?.orderDetailsId });
    setDonePopUp(false);
  }
  useEffect(() => {
    console.log("fetchedData", fetchedData);
  }, [fetchedData]);
  return (
    <div
    // style={{ display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "space-between", gap: "10px" }}
    // style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}
    // className="tickets-dep"
    >
      {
        !individual ?
          //  fetchedData?.map((item, index) => (
          <RunningOrders
            // key={index}
            depId={depId}
            // all={false}
            // orderId={item?.header?.orderHeaderId}
            isReadOnly={false}
            ticketStyle={true}
          // individual={individual}
          />
          // ))
          :
          <RunningOrders
            // key={index}
            depId={depId}
            all={false}
            // orderId={item?.header?.orderHeaderId}
            isReadOnly={false}
            ticketStyle={true}
            individual={individual}
          />
      }

      {holdPopUp && (
        <ConfirmationPopUp
          msg={
            <>
              Are you sure you want to hold the item{" "}
              <strong>{holdPopUp?.orderDetailsName}</strong>?
            </>
          }
          onClose={() => setHoldPopUp(false)}
          onConfirm={handleHold}
        />
      )}
      {donePopUp && (
        <ConfirmationPopUp
          msg={
            <>
              Are you sure you want to mark the item{" "}
              <strong>{donePopUp?.orderDetailsName}</strong> as done?
            </>
          }
          onClose={() => setDonePopUp(false)}
          onConfirm={handleDone}
        />
      )}
    </div>
  );
}

export default TicketsDepatment;
