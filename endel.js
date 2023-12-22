var obj = JSON.parse($response.body);

obj["profile"]= {
        "is_admin": true,
        "is_editor": true,
        "is_student": true
};

obj["notification_settings"]= [
        {
            "type": "PROMO",
            "is_on": false
        },
        {
            "type": "SUGGESTIONS",
            "is_on": true
        },
        {
            "type": "NEWS",
            "is_on": false
        },
        {
            "type": "INSIGHTS",
            "is_on": true
        },
        {
            "type": "SUNSET",
            "is_on": true
        }
    ];

obj["analytics_profile"] = "";



obj["subscription"]= {
        "promo_type": "DEFAULT",
        "period": "LIFETIME",
        "store_trial": false,
        "time_left": 9685854580,
        "price_id": "unknown",
        "valid_until": 9669710512,
        "type": "ACTIVE",
        "trial_type": "CALENDAR_BASED",
        "cancel_at_period_end": true,
        "multiple_subscriptions": true,
        "store": "APP_STORE",
        "trial_canceled": true
    };

$done({body: JSON.stringify(obj)});
