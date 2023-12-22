var obj = JSON.parse($response.body);

obj["profile"]= {
        "is_admin": true
};

$done({body: JSON.stringify(obj)});
