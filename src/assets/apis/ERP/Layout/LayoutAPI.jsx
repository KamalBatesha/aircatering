
const baseURL = import.meta.env.VITE_API_BASE_URL;

import axios from "axios";
import axiosInstance, { uploadAxiosInstance } from "../../axios";

export function GetMenuItem() {
  return axiosInstance
    .get("/api/System/ProgramMenu/GenLkpProgramMenus/UserAuthMenu")
    .then((res) => {
      // console.log(res);
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetUserMenuItem(persId) {
  return axiosInstance
    .get(`/api/USerAuthProgramMenu/SelectedUserAuthMenu?PersId=${persId}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetDepMenuItem(DepId) {
  return axiosInstance
    .get(`/api/USerAuthProgramMenu/GetDepartmentAccess?DepId=${DepId}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetUserMenuItemActions(menuId, persId) {
  return axiosInstance
    .get(
      `/api/USerAuthProgramMenu/UserActionButtons?MenuId=${menuId}&PersId=${persId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetUserMenuItemActionsAuth(menuId) {
  return axiosInstance
    .get(`/api/USerAuthProgramMenu/ActionButtons?MenuId=${menuId}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function AddUserMenuItem(menuId, persId) {
  return axiosInstance
    .post(
      `/api/USerAuthProgramMenu/AddMenuToUser?MenuId=${menuId}&PersId=${persId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

export function AddDepMenuItem(menuId, DepId) {
  return axiosInstance
    .post(
      `/api/USerAuthProgramMenu/AddMenuToDepartment?MenuId=${menuId}&DepId=${DepId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function AddGroupsMenu(persID, groupID) {
  return axiosInstance
    .post(
      `/api/AuthGroups/AddGroups?PersID=${persID}&GroupID=${groupID}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function RemoveGroupsMenu(persID, groupID) {
  return axiosInstance
    .delete(
      `/api/AuthGroups/Groups?PersID=${persID}&GroupID=${groupID}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function RemoveDepMenuItem(menuId, DepId) {
  //console.log(menuId, DepId);
  return axiosInstance
    .delete(
      `/api/USerAuthProgramMenu/DeleteMenuToDepartment?MenuId=${menuId}&DepId=${DepId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function RemoveUserMenuItem(menuId, persId) {
  //console.log(menuId, persId);
  return axiosInstance
    .delete(
      `/api/USerAuthProgramMenu/DeleteMenuToUser?MenuId=${menuId}&PersId=${persId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function AddUserActionMenuItem(menuId, persId, data) {
  //console.log(data, menuId, persId);
  return axiosInstance
    .post(
      `/api/USerAuthProgramMenu/AddMenuToUserButtons?MenuId=${menuId}&PersId=${persId}`,
      data
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetGenericMenuItem() {
  return axiosInstance
    .get("/api/System/ProgramMenu/GenLkpProgramMenus")
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

// export function GetGenericMenuItem() {
//   return axiosInstance
//     .get("/api/System/ProgramMenu/GenLkpProgramMenus")
//     .then((res) => {
//       //console.log(res);
//       return res.data;
//     })
//     .catch((error) => {
//       console.error("Error fetching MenuList:", error);
//       throw error;
//     });
// }

export function AddMenuItem(data) {
  return axiosInstance
    .post("/api/System/ProgramMenu/GenLkpProgramMenus", data)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function UpdateMenuItem(menuId, data) {
  //console.log(data);
  return axiosInstance
    .patch(
      `/api/System/ProgramMenu/GenLkpProgramMenus/UpdateMenuItem?Menuid=${menuId}`,
      data
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetMenuActions(menuId) {
  return axiosInstance
    .get(
      `/api/System/ProgramMenu/GenLkpProgramMenus/MenuItemActions?MenuId=${menuId}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetGenericMenuActions() {
  return axiosInstance
    .get("/api/System/ProgramMenu/GenLkpProgramMenus/Actions")
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function AddActionButton(menuId, data) {
  //console.log("Drom add aciton button ");
  //console.log(data, menuId);
  return axiosInstance
    .post(
      `/api/System/ProgramMenu/GenLkpProgramMenus/ActionButtons?MenuId=${menuId}`,
      data
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

export function GetLogs(menuId, itemId) {
  return axiosInstance
    .get(`/api/SystemGetLog?MenuId=${menuId}&ActionId=${itemId}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetStarList() {
  return axiosInstance
    .get("/api/StarList")
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}
export function GetTrashList() {
  return axiosInstance
    .get("/api/TrashedList")
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

export function GetDownloads() {
  return axiosInstance
    .get("/api/DownloadedList")
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching Downloads:", error);
      throw error;
    });
}
export async function GetDownloadedFile(fileName) {
  console.log(fileName);
  const token = JSON.parse(localStorage.getItem("user")).encodedPayload;
  try {
    const url = `${baseURL}/api/OpenDownloadFiles/open?fileName=${fileName}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Blob Data:", blob);

    const fileURL = URL.createObjectURL(blob);
    console.log("File URL:", fileURL);

    window.open(fileURL, "_blank");

    return blob;
  } catch (error) {
    console.error("Error fetching Downloads:", error);
    throw error;
  }
}
export function AddToDownloads(data) {
  return uploadAxiosInstance
    .post("/api/DownloadedList", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching Downloads:", error);
      throw error;
    });
}

export function GetSharedRecordsList(id) {
  return axiosInstance
    .get(`/api/Shared/Records?CategoryId=${id}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching shared list:", error);
      throw error;
    });
}
export function GetSharedMenusList() {
  return axiosInstance
    .get(`/api/Shared/Menus`)
    .then((res) => {
      //console.log(res);
      console.log("MENUSSS", res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching shared Menus:", error);
      throw error;
    });
}

export function AddSharedList(data) {
  return axiosInstance
    .post("/api/Shared", { ...data }, {})
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error adding shared item:", error);
      throw error;
    });
}
export function CloseOneTimer(data) {
  console.log("API CLOSE CALLED:data", data);
  return axiosInstance
    .post(`api/Shared/OneTimeShareClose?ShardItemID=${data}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error closing shared item:", error);
      throw error;
    });
}

export function AddNewTicket(data, token) {
  return axios
    .post(
      `https://apitiketing.zarkani-group.com/api/Tiket?_token=${token}`,
      data,
      {
        timeout: 10000,
      }
    )
    .then((res) => {
      // Check if the backend included a failure flag
      if (res.status !== 200) {
        throw new Error(res.data.message || "Adding Ticket failed");
      }
      return res.data;
    })
    .catch((err) => {
      console.error("Adding Ticket error:", err);
      throw new Error(err.message || "Adding Ticket failed"); // This is important for react-query to catch the error
    });
}
export function AddInvMenuItem(persId, storeID, sectoreID) {
  return axiosInstance
    .post(
      `/api/UserStoreSectoreAccess/StoreUserAccess?PersId=${persId}&StoreID=${storeID}&SectoreID=${sectoreID}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

export function RemoveInvMenuItem(id) {
  //console.log(menuId, persId);
  return axiosInstance
    .delete(
      `/api/UserStoreSectoreAccess/StoreUserAccess?ID=${id}`
    )
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching MenuList:", error);
      throw error;
    });
}

export function GetStoreUserAccessList(persId) {
  return axiosInstance
    .get(`/api/UserStoreSectoreAccess/StoreUserAccess?PersId=${persId}`)
    .then((res) => {
      //console.log(res);
      console.log("MENUSSS", res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching shared Menus:", error);
      throw error;
    });
}
export function GetEmployeeGroupsList(persId) {
  return axiosInstance
    .get(`/api/AuthGroups/EmpoyeeGroups?PersId=${persId}`)
    .then((res) => {
      //console.log(res);
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
}
