import axiosInstance from "../axios";

export function AddItemRecipe(foodItemID, data, ManefacureItem) {
  return axiosInstance
    .post(
      `api/ItemsRecipe/AddRecipeItem?FoodItemID=${foodItemID}${ManefacureItem ? "&ManefacureItem=false" : ""}`,
      data
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}
export function UpdatePriceItems(data) {
  return axiosInstance
    .post(
      `/api/FoodMenuItemsUpdatePrice/SelectMenuItemsPrice`,
      data
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export function EditItemRecipe(foodItemID, data, ManefacureItem) {
  console.log("foodItemIDlol ==> ", foodItemID);
  // FoodItemID;
  return axiosInstance
    .patch(
      `api/ItemsRecipe/RecipeItem?FoodItemID=${foodItemID}${ManefacureItem ? "&ManefacureItem=true" : ""}`,
      data
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export function DeleteItemRecipe(foodMenuItemRecibeId) {
  return axiosInstance
    .delete(
      `api/ItemsRecipe/RecipeItem?FoodMenuItemRecibeId=${foodMenuItemRecibeId}`
    )
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export function CloseItemRecibe(itemId) {
  return axiosInstance
    .post(
      `/api/RecipeGeneralSelection/CloseItemRecibe?FoodMenuItemid=${itemId}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetUpdatePriceList() {
  return axiosInstance
    .get(
      `/api/FoodMenuItemsUpdatePrice`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function GetUpdatePriceListById(pricelistHeaderID) {
  return axiosInstance
    .get(
      `/api/FoodMenuItemsUpdatePrice/${pricelistHeaderID}`
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function ChangePrice(data) {
  return axiosInstance
    .post(
      `/api/FoodMenuItemsUpdatePrice/updateMenuItemsPrice`,
      data
    )
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}