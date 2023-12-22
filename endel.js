var obj = JSON.parse($response.body);

obj["profile"]= {
        "is_admin": true,
        "is_editor": true,
        "is_student": true
};

$done({body: JSON.stringify(obj)});
