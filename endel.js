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

    // 使用filter方法创建新的dynamic_variables数组
    obj.dynamic_variables = obj.dynamic_variables.filter(variable => {
        if (variable.value_name) {
            return !shouldDelete(variable);
        }

        if (variable.send_to_analytic) {
            variable.send_to_analytic = false;
        }
        return true;
    });

    obj.subscription = {
        promo_type: "DEFAULT",
        period: "LIFETIME",
        store_trial: false,
        time_left: 9685854580,
        price_id: "unknown",
        valid_until: 9669710512,
        type: "ACTIVE",
        trial_type: "CALENDAR_BASED",
        cancel_at_period_end: true,
        multiple_subscriptions: true,
        store: "APP_STORE",
        trial_canceled: true
    };
}

const shouldDelete = variable => {
    if (variable.value_name) {
        const lowerValueName = variable.value_name.toLowerCase();
        
        return (
            lowerValueName.includes("referral") 
            || lowerValueName.includes("unsubscribed")
        );
    }
    
    if (variable.name) {
        return variable.name.toLowerCase().includes("tutorial");
    }

    return false;
};

$done({ body: JSON.stringify(obj) });
