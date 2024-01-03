/*
QX: ^https:\/\/m\.815616\.xyz\/api\/v2\/myinfo\/ url script-response-body shangqiuyuedu.js

hostname = *.815616.com
*/

let obj = JSON.parse($response.body);
let url = $request.url;

if (url.indexOf("21df7c478") != -1) {
    obj.data.forEach(element => {
        if (element.uuid === "21df7c478") {
            element.banned = "0";
            element.vipto = "2099-10-05 07:32:26";
        }
    });
}

$done({ body: JSON.stringify(obj) });
