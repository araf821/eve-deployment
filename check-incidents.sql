-- Check all incident locations in the database
SELECT 
    a.id,
    a.user_id,
    u.name as user_name,
    u.email as user_email,
    a.lat,
    a.lng,
    a.address,
    a.description,
    a.has_image,
    a.created_at
FROM alert a
LEFT JOIN "user" u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- Summary statistics
SELECT 
    COUNT(*) as total_incidents,
    COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as incidents_last_24h,
    COUNT(CASE WHEN has_image = 'true' THEN 1 END) as incidents_with_images
FROM alert; 