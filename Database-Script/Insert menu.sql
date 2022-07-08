/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[rowOrder]
      ,[remark]
      ,[activeStatus]
      ,[createBy]
      ,[createDate]
      ,[updateBy]
      ,[updateDate]
      ,[menuName]
      ,[menuUrl]
      ,[menuIcon]
      ,[menuCode]
  FROM [ALO_DEV_DB].[dbo].[menu_level1]
  


  select *from menu_level1
  --delete from menu_level1
  INSERT INTO menu_level1 ( [id]
      ,[rowOrder]
      ,[remark]
      ,[activeStatus]
      ,[createBy]
      ,[createDate]
      ,[updateBy]
      ,[updateDate]
      ,[menuName]
      ,[menuUrl]
      ,[menuIcon]
      ,[menuCode])
	VALUES 
		 (NEWID() , 1,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Input Data',NULL,'simple-icon-screen-desktop',NULL)
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Optimize & Result',NULL,'iconsminds-optimization',NULL)
		,(NEWID() , 3,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Planning Report',NULL,'iconsminds-file',NULL)
		,(NEWID() , 4,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Inventory & LR Constrain',NULL,'iconsminds-space-needle',NULL)
		,(NEWID() , 5,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Customer Constrain',NULL,'simple-icon-user',NULL)
		,(NEWID() , 6,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'System',NULL,'iconsminds-library',NULL)

	--select *from menu_level2
	INSERT INTO menu_level2 ( [id]
      ,[rowOrder]
      ,[remark]
      ,[activeStatus]
      ,[createBy]
      ,[createDate]
      ,[updateBy]
      ,[updateDate]
      ,[menuName]
      ,[menuUrl]
      ,[menuIcon]
      ,[menuCode]
	  ,[menuLevel1Id])
	VALUES 
		 (NEWID() , 1,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Supply Plan','','simple-icon-arrow-down',10, (select top 1 ID from menu_level1 where menuName = 'Input Data') )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Reference Price',NULL,'simple-icon-arrow-down',20, (select top 1 ID from menu_level1 where menuName = 'Input Data') )

	--level 2 Planning Report 
		INSERT INTO menu_level2 ( [id]
      ,[rowOrder]
      ,[remark]
      ,[activeStatus]
      ,[createBy]
      ,[createDate]
      ,[updateBy]
      ,[updateDate]
      ,[menuName]
      ,[menuUrl]
      ,[menuIcon]
      ,[menuCode]
	  ,[menuLevel1Id])
	VALUES 
		 (NEWID() , 1,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Etane Planing','','simple-icon-arrow-down',(select max(menuCode)+10 from menu_level2), (select top 1 ID from menu_level1 where menuName = 'Planning Report') )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Inform OR',NULL,'simple-icon-arrow-down',20, (select top 1 ID from menu_level1 where menuName = 'Planning Report') )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'LPG Rolling',NULL,'simple-icon-arrow-down',20, (select top 1 ID from menu_level1 where menuName = 'Planning Report') )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'GSP Product Balance',NULL,'simple-icon-arrow-down',20, (select top 1 ID from menu_level1 where menuName = 'Planning Report') )
	
	--select *from menu_level3
	UPDATE menu_level3
	set menuName = 'Ability KHM'
	where menuName = 'Ability Khm'
	INSERT INTO menu_level3 ( [id]
      ,[rowOrder]
      ,[remark]
      ,[activeStatus]
      ,[createBy]
      ,[createDate]
      ,[updateBy]
      ,[updateDate]
      ,[menuName]
      ,[menuUrl]
      ,[menuIcon]
      ,[menuCode]
	  ,[menuLevel2Id]
	  ,[menuLevel1Id])
	VALUES 
		 (NEWID() , 1,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Ability Rayong',NULL,'iconsminds-factory',10, (select top 1 ID from menu_level1 where menuName = 'Supply Plan'), (select top 1 ID from menu_level1 where menuName = 'Input Data')  )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Ability Pentane',NULL,'iconsminds-factory',10, (select top 1 ID from menu_level1 where menuName = 'Supply Plan') , (select top 1 ID from menu_level1 where menuName = 'Input Data') )
		,(NEWID() , 3,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Ability Khm',NULL,'iconsminds-factory',10, (select top 1 ID from menu_level1 where menuName = 'Supply Plan'), (select top 1 ID from menu_level1 where menuName = 'Input Data')  )
		,(NEWID() , 4,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Ability โรงกลั่น',NULL,'iconsminds-factory',10, (select top 1 ID from menu_level1 where menuName = 'Supply Plan') , (select top 1 ID from menu_level1 where menuName = 'Input Data') )

		,(NEWID() , 1,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Cost',NULL,'simple-icon-diamond',10, (select top 1 ID from menu_level1 where menuName = 'Reference Price'), (select top 1 ID from menu_level1 where menuName = 'Input Data') )
		,(NEWID() , 2,NULL, 1 , 0, GETDATE(), 0, GETDATE(), 'Reference Price',NULL,'simple-icon-tag',10, (select top 1 ID from menu_level1 where menuName = 'Reference Price'), (select top 1 ID from menu_level1 where menuName = 'Input Data') )
	

	--simple-icon-arrow-down