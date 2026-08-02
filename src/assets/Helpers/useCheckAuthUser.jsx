import { useEffect, useState } from "react";
import Mutations from "./Mutations";

import useAuthStore from "../../../src/assets/Zustand/Auth/UserAuth";
import { AuthLogout } from "../Api/Auth/AuthAPI";

function useCheckAuthUser() {
  const logout = useAuthStore((state) => state.logout);
  const { loginRefreshMutation } = Mutations();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let clicks = 0;
    let sleepFor = 0;
    const activityHandler = () => {
      clicks += 1;
      document.body.style.cursor = "default";
      document.body.style.opacity = "1";
    };

    document.addEventListener("mousedown", activityHandler, { capture: true });
    document.addEventListener("click", activityHandler, { capture: true });
    document.addEventListener("keydown", activityHandler, { capture: true });
    const checkAuth = () => {
      if (document.location.pathname.includes("login")) {
        setIsChecking(false);
        return;
      }
      console.log("localClicks: ", clicks);
      console.log("sleepFor at start: ", sleepFor);
      let user;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        logout();
        setIsChecking(false);
        return;
      }
      if (clicks > 0) {
        // click system
        clicks = 0;

        document.body.style.cursor = "default";
        document.body.style.opacity = "1";
        if (sleepFor >= 6) {
          // wake up the backend if it was sleeping
          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/Authonticate/EmpSleepReplace?sleep=false`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.encodedPayload}`,
              },
            }
          );
        }
        sleepFor = 0;
      } else {
        sleepFor += 1;
      }
      if (sleepFor == 6) {
        document.body.style.cursor = "wait";
        document.body.style.opacity = "0.3";
        // /api/Authonticate/EmpSleepReplace
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Authonticate/EmpSleepReplace?sleep=true`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.encodedPayload}`,
            },
          }
        );
      }
      if (sleepFor >= 25) {
        console.warn("No activity for 25 minutes. Logging out.");
        logout();
        AuthLogout();
        window.location.reload();
      }
      const validToRaw = user?.validTo;
      if (!validToRaw) {
        console.warn("No validTo found. Removing user.");
        setIsChecking(false);
        return;
      }

      const expiryTime = new Date(validToRaw).getTime();
      const currentTime = Date.now();

      const timeLeftMinutes = (expiryTime - currentTime) / 1000 / 60;
      const timeLeftToRefresh = timeLeftMinutes - 3; // 3 minutes before expiry

      console.log(
        `⏱ Token expires in: ${timeLeftMinutes.toFixed(2)} minutes`,
        `⏱ Token refresh in: ${timeLeftToRefresh.toFixed(2)} minutes`,
        "\n📅 ValidTo (UTC):",
        new Date(expiryTime).toUTCString(),
        "\n🕓 Current time (UTC):",
        new Date(currentTime).toUTCString()
      );

      if (timeLeftToRefresh <= 0) {
        console.warn("⚠️ Token is expired. Trying to refresh...");
        loginRefreshMutation.mutate(
          {},
          {
            onSuccess: (newUser) => {
              localStorage.setItem("user", JSON.stringify(newUser));
              console.log("✅ Token refreshed successfully.");
              setIsChecking(false);
            },
            onError: () => {
              console.error("❌ Refresh failed. Removing user.");
              logout();
              setIsChecking(false);
            },
          }
        );
      } else {
        setIsChecking(false);
      }
    };

    checkAuth(); // Run immediately
    const interval = setInterval(checkAuth, 60 * 1000);

    // window.onbeforeunload = async function (event) {
    //   await AuthLogout();
    //   logout();
    // };
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", activityHandler, { capture: true });
      document.removeEventListener("click", activityHandler, { capture: true });
      document.removeEventListener("keydown", activityHandler, { capture: true });
      sleepFor = 0;
      clicks = 0;
      document.body.style.cursor = "default";
      document.body.style.opacity = "1";
    };
  }, []);

  return { isChecking };
}

export default useCheckAuthUser;
