SELECT 
  * 
FROM users  
WHERE 
  name = 'John' 
  AND qty = 19 
  AND createdAt = '2024-09-09T12:54:44.207Z' 
  AND isActive = 1 
  AND updatedAt >= '2024-09-09T12:54:44.207Z' 
  AND updatedAt <= '2024-09-09T12:54:44.207Z' 
  AND no IN (1, 2, 3) 
  AND no2 IN ('1', '2', '3') 
  AND status NOT IN ('active', 'inactive') 
  AND (
    (
      name2 = 'John2' 
      AND name3 = 'John3'
    ) 
    AND (
      name4 = 'John4' 
      AND name5 = 'John5'
    ) 
    AND (
      (
        (
          name6 = 'John6' 
          AND name7 = 'John7'
        ) 
        OR (
          name8 = 'John8' 
          AND name9 = 'John9'
        )
      )
    )
  )
