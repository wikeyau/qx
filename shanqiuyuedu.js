/*
QX: ^https:\/\/api\.revenuecat\.com\/v1\/subscribers\/ url script-response-body revenuecat.js

hostname = api.revenuecat.com
*/

let obj = JSON.parse($response.body);
let url = $request.url;

if (url.includes("21df7c478")) {
    obj.data.forEach(element => {
        if (element.uuid === "21df7c478") {
            element.banned = "0";
            element.vipto: "2023-10-05 07:32:26";
        }
    });
}

$done({ body: JSON.stringify(obj) });
