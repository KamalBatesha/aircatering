import axiosInstance from "../axios";

export function GetAllProducts(menuTypeId) {
    let typeId = menuTypeId;
    if (typeof menuTypeId === "object" || !menuTypeId) {
        const isStella = window?.location?.href?.toLowerCase()?.includes("stella");
        typeId = isStella ? 4 : 3;
    }

    return axiosInstance
        .get(
            `/api/OnlineOrders/GeneralSelection/GrandGroupList?menuTypeId=${typeId}`,
        )
        .then(async (response) => {
            //console.log(response);
            return response?.data;
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
}
export function createOrderByClient(data) {
    return axiosInstance
        .post(`/api/AirCatering/SaveOrderHeaderAirCatring?MenuId=0`, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}


export function UpdateOrderDetails(data) {
    return axiosInstance
        .post(`/api/AirCatering/SaveOrderDetailsAirCatering?MenuId=0`, data)
        .then((response) => {
            console.log("response200", response);
            if (response.status === 200) {
                return response.data || response;
            }
        })
        .catch((error) => {
            //console.log(error);
            throw error;
        });
}

export function DeleteOrderItemAirCatering(detailId) {
    return axiosInstance
        .delete(`/api/AirCatering/DeleteOrderItemAirCatering?DetailId=${detailId}`)
        .then((response) => {
            return response.data || response;
        })
        .catch((error) => {
            throw error;
        });
}

export function AddFavoriteItem(ItemId) {
    return axiosInstance
        .post(`/api/AirCatering/AddFavoriteItem?ItemId=${ItemId}`)
        .then((response) => {
            return response.data || response;
        })
        .catch((error) => {
            throw error;
        });
}

export function GetClientFavoriteItems() {
    return axiosInstance
        .get(`/api/AirCatering/GetClientFavoriteItems`)
        .then((response) => {
            return response.data || response;
        })
        .catch((error) => {
            throw error;
        });
}

export function RemoveFromFavoriteItems(itemId) {
    return axiosInstance
        .delete(`/api/AirCatering/RemoveFromFavoriteItems?itemId=${itemId}`)
        .then((response) => {
            return response.data || response;
        })
        .catch((error) => {
            throw error;
        });
}

export function UpdateOrderHeaderAirCatering(OrderId, data) {
    return axiosInstance
        .patch(`/api/AirCatering/UpdateOrderHeaderAirCatering?OrderId=${OrderId}`, data)
        .then((response) => {
            return response.data || response;
        })
        .catch((error) => {
            throw error;
        });
}