import axiosInstance from "../axios";

export function GetMenuRequestsList(status, fromDate, toDate) {
    return axiosInstance
        .get(`/api/Authonticate/GetCustomersByStatus`, {
            params: { status, fromDate, toDate },
        })
        .then((r) => r.data)
        .catch((err) => { throw err; });
}

export function ApproveCustomer(customerId, remarks = "") {
    return axiosInstance
        .post(`/api/Authonticate/HandleCustomerApproval`, {
            customerId: customerId,
            isApproved: true,
            remarks: remarks,
        },
            //    {
            //   params: { customerId },
            // }
        )
        .then((r) => r.data)
        .catch((err) => { throw err; });
}

export function DisapproveCustomer(customerId, remarks = "") {
    return axiosInstance
        .post(`/api/Authonticate/HandleCustomerApproval`, {
            customerId: customerId,
            isApproved: false,
            remarks: remarks,
        },
            //   {
            //   params: { customerId },
            // }
        )
        .then((r) => r.data)
        .catch((err) => { throw err; });
}
