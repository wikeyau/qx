/*
QX: ^https:\/\/api\.revenuecat\.com\/v1\/subscribers\/ url script-response-body revenuecat.js

hostname = api.revenuecat.com
*/

let header=$request.header
let obj=JSON.parse($response.body);
let url=$request.url;

if(url.endsWith("offerings")||url.endsWith("products")) {
	$done({});
} else {
	// Rise Sleep APP
	// if (header.get('X-Client-Bundle-ID') === 'com.risesci.nyx') {
	if (url.indexOf("4690907")!=-1) {
		obj["subscriber"]["entitlements"]["Pro"]={
            "grace_period_expires_date": null,
            "purchase_date": "2019-12-24T00:00:00Z",
            "product_identifier": "com.risesci.nyx.subscriptions.annual",
			"expires_date": null,
		};
		obj["subscriber"]["subscriptions"]["com.risesci.nyx.subscriptions.annual"]=[{
            "original_purchase_date": "2019-12-24T00:00:00Z",
            "expires_date": null,
            "is_sandbox": false,
            "refunded_at": null,
            "store_transaction_id": "410001457697938",
            "unsubscribe_detected_at": null,
            "grace_period_expires_date": null,
            "period_type": "annual",
            "purchase_date": "22019-12-24T00:00:00Z",
            "billing_issues_detected_at": null,
            "ownership_type": "PURCHASED",
            "store": "app_store",
            "auto_resume_date": null
		}];
	}
}

$done({body:JSON.stringify(obj)});
