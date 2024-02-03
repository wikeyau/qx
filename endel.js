const shouldDelete = variable => {
    if (variable.value_name) {
        const lowerValueName = variable.value_name.toLowerCase();
        return lowerValueName.includes("referral") 
            || lowerValueName.includes("unsubscribed")
            || lowerValueName.includes("trial");
    }

    if (variable.name) {
        return variable.name.toLowerCase().includes("tutorial");
    }
}

var obj = JSON.parse($response.body);

if (obj.hasOwnProperty("dynamic_variables")) {
    obj.profile = {
        is_admin: true,
        is_editor: true,
        is_student: true
    };

    obj.notification_settings = [
        { type: "PROMO", is_on: false },
        { type: "SUGGESTIONS", is_on: false },
        { type: "NEWS", is_on: false },
        { type: "INSIGHTS", is_on: true },
        { type: "SUNSET", is_on: true }
    ];

    obj.analytics_profile = "";

    // Use filter method with inline condition
    obj.dynamic_variables = obj.dynamic_variables.filter(variable => {
        if(variable.send_to_analytic) {
            variable.send_to_analytic = false;
        }

        // 要删除的话就不保留，返回 false
        return !shouldDelete(variable);
    });

    obj.subscription = {
        "promo_type" : "DEFAULT",
        "period" : "YEAR",
        "store_trial" : false,
        "time_left" : 0,
        "price_id" : "12_Months_Instant_Offer",
        "valid_until" : 4092599349,
        "type" : "ACTIVE",
        "trial_type" : "CALENDAR_BASED",
        "prev_store" : "NOSTORE",
        "cancel_at_period_end" : false,
        "multiple_subscriptions" : false,
        "store" : "APP_STORE",
        "trial_canceled" : false
    };
}

$done({ body: JSON.stringify(obj) });
