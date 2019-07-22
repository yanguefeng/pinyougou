 //控制层 
app.controller('itemCatController' ,function($scope,$controller   ,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			$scope.entity.parentId=$scope.parentId;
			serviceObject=itemCatService.add($scope.entity);//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.findByParentId($scope.parentId)//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){
		if ($scope.grade ==3){
            //获取选中的复选框
            itemCatService.dele( $scope.selectIds ).success(
                function(response){
                    if(response.success){
                        $scope.reloadList();//刷新列表
                        $scope.selectIds=[];
                        //调用查询方法
                        $scope.findByParentId(p_entity.id)
                    }
                }
            );
        }

	};
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	//根据parentId查询下级的数据
	$scope.findByParentId=function (parentId) {

		//查询的时候我们记住上级id
        $scope.parentId=parentId;

		itemCatService.findByParentId(parentId).success(function (respones) {
			$scope.list=respones;
        })
    }

    //定义等级变量默认值为1
	$scope.grade=1;

	//定义改变等级的方法
	$scope.setGrade=function () {
		$scope.grade ++;
    }

    //定义方法，是面包屑导航条完成点击下级出现点击之前的分类名，回退当前的分类名消失
	$scope.selectList=function (p_entity) {

		if ($scope.grade ==1){
			$scope.entity_1=null;
            $scope.entity_2=null;
		}

        if ($scope.grade ==2){
            $scope.entity_1=p_entity;
            $scope.entity_2=null;
        }
        if ($scope.grade ==3){
            $scope.entity_2=p_entity;
        }

        //调用查询方法
		$scope.findByParentId(p_entity.id)
    };


    //定义一个变量记住上级id，添加的时候根据id添加分类
	$scope.parentId=0;

	$scope.templateList={data:[]};

	$scope.selectOptionList=function () {
		typeTemplateService.selectOptionList().success(function (respones) {
			$scope.templateList={data:respones}
        })
    }

});	
