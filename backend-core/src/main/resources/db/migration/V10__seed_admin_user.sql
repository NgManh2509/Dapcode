INSERT INTO users (
    id, 
    username, 
    email, 
    role, 
    is_active, 
    xp, 
    streak_count, 
    avatar_url, 
    created_at, 
    updated_at
)
VALUES (
    gen_random_uuid(),
    'dapcode_admin',
    'admin@dapcode.io',
    'ROLE_ADMIN',
    TRUE,
    9999,
    30,
    'https://api.dicebear.com/7.x/bottts/svg?seed=dapcode_admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE 
SET role = 'ROLE_ADMIN', is_active = TRUE;
