import { getToken } from "@/utils/authUtils";

interface headersType {
    "Content-Type"?: string,
    Accept?: string,
    Authorization?: string
}

// interface postType {
//     endpoint: string,
//     jsonObject: any
// }

// interface fetchDataType {
//     endpoint: string,
//     requestOptions: {
//         method: string,
//         headers: headersType,
//         body: any
//     }
// }

export default class loginRequiredProxy {

    static async getHeaders(headers: headersType) {
        const authToken = getToken();
        headers["Authorization"] = `Bearer ${authToken}`;
        return headers
    }

    static async fetchData(endpoint: string, requestOptions: any) {
        let data = {};
        let status = 500;
        try {
            const response = await fetch(endpoint, requestOptions)
            data = await response.json()
            status = response.status
        } catch (error) {
            data = {message: "Cannot reach API server", error: error}
        }
        return {data, status}
    }

    static async postJson(endpoint: string, jsonObject: any) {
        const headers = await loginRequiredProxy.getHeaders({
            "Content-Type": "application/json",
            Accept: "application/json"
        })
        const requestOptions = {
            method: "POST",
            headers: headers,
            body: jsonObject
        }
        return await loginRequiredProxy.fetchData(
            endpoint,
            requestOptions
        )
    }

    static async putJson(endpoint: string, jsonObject: any) {
        const headers = await loginRequiredProxy.getHeaders({
            "Content-Type": "application/json",
            Accept: "application/json"
        })
        const requestOptions = {
            method: "PUT",
            headers: headers,
            body: jsonObject
        }
        return await loginRequiredProxy.fetchData(
            endpoint,
            requestOptions
        )
    }
}