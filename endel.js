var obj = JSON.parse($response.body);

obj["profile"]= {
        "is_admin": false,
        "is_editor": true
};

$done({body: JSON.stringify(obj)});
