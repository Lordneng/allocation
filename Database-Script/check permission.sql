SELECT msg.name, ml1.menuName AS levell1 , ml2.menuName AS levell2 , ml3.menuName AS level3
  ,ps.*FROM permission ps
LEFT JOIN menu_level1 ml1 ON ps.menulevel1Id = ml1.id
LEFT JOIN menu_level2 ml2 ON ps.menulevel2Id = ml2.id
LEFT JOIN menu_level3 ml3 ON ps.menulevel3Id = ml3.id
LEFT JOIN master_user_group msg ON ps.userGroupId = msg.id
LEFT JOIN master_user_group_list mugl ON msg.id = mugl.user_group_id
LEFT JOIN [user] u ON mugl.user_id = u.id
WHERE 0=0
  --ps.menulevel1Id = '4e8d5589-0671-4646-b462-86ae639ac6cb'
--AND ml2.id = '7bd4f7f8-d0e0-43db-8903-dc830a672173'
--AND u.userName = 'zsuntipab.k'
AND ps.userGroupId = '8e097302-aaf1-41bf-862e-4b0757a747a2'



SELECT *FROM master_user_group WHERE id = '8e097302-aaf1-41bf-862e-4b0757a747a2' --chalida test

