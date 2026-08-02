import { updateAccessToken } from "../apis/Auth/AuthAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onlineOrderToast } from "./onlineOrderToast";
// queryClient,

// AddNewNote
import { AddNewNote } from "./MutationsApis/innerTapsMutations";
import useMenuStore from "../store/MenuIems/MenuItems";
import useAuthStore from "../store/authStore";
function Mutations() {
  const levelOneActive = useMenuStore((state) => state.levelOneActive);
  const levelThreeActive = useMenuStore((state) => state.levelThreeActive);
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const loginRefreshMutation = useMutation({
    mutationKey: ["loginRefresh"],
    mutationFn: () => updateAccessToken(),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      login(data);
    },
    onError: () => {
      onlineOrderToast.error("Session expired. Please log in again.");
    },
  });
  const AddNote = useMutation({
    mutationKey: ["AddNote"],
    mutationFn: ({ data, dep }) => AddNewNote(levelThreeActive, dep, data),
    onSuccess: () => {
      onlineOrderToast.success("Note Added");
      queryClient.invalidateQueries(["notes"])
      // queryClient.invalidateQueries({
      //   queryKey: ["flightId", id],
      // });
      // queryClient.invalidateQueries({ queryKey: ["Flights"] });
      // queryClient.invalidateQueries({
      //   queryKey: ["FlightPermits", id],
      // });
      // queryClient.invalidateQueries({ queryKey: ["StationFlights"] });
      // queryClient.invalidateQueries({ queryKey: ["outstanding"] });
      // queryClient.invalidateQueries({ queryKey: ["FlightsPurpose"] });
      // queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
    onMutate: () => {
      onlineOrderToast.loading("Adding Note");
    },
    onError: () => {
      onlineOrderToast.error("Failed to Add Note");
    },
  });

  return {
    loginRefreshMutation,
    AddNote,
  };
}

export default Mutations;
