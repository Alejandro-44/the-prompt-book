from bson.objectid import ObjectId

mock_users = [{
  "_id": ObjectId("6930faa5239be95b75ed3c5c"),
  "username": "johndoe",
  "email": "johndoe@example.com",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$kJyTStK6VL+0CQqsjIaefQ$ZICjyHmI44FG0IbhgSZuO+Aw+dGdM/uRb2tfaUyrWNU",
  "is_active": True
},
{
  "_id": ObjectId("6939872c7f7a423bcb83fe0b"),
  "username": "alex",
  "email": "alex@example.com",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$vPNCQ/X+Zx7pGoLIfVGcGA$tEDmDukrnxPytyC4oe6Kwzmk6v9fUBwSA958u+PPyfg",
  "is_active": True
},
{
  "_id": ObjectId("693987497f7a423bcb83fe0c"),
  "username": "matt_coder",
  "email": "matt@example.com",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$aKXzzzxUiSfoQluiyIGvzQ$DpPc+GGVDYOXfpdG3+CajciWJIlZXF8b8aLVCnfTOhc",
  "is_active": True
},
{
  "_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "username": "luna_writer",
  "email": "lune@example.com",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wCXuEJNJYA9C87WcjTVq1w$9hcBZcnhR7rSpp64F89lZiZ73Fj7MR6rNyT4uxkpEcE",
  "is_active": True
},
{
  "_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "username": "creative_io",
  "email": "creative@example.com",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$S0Hhi4c9fO5ZXfl3VG9O2A$llVE/2jCDDi9dPj4ZYBWXg92GaTqtJUAQtH+bGUNbP4",
  "is_active": True
}]
