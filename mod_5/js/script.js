$(function () {
  $("#navbartoggle").blur(function (event) {
    if (window.innerWidth < 768) {
      $("#mytarget").collapse('hide');
    }
   });
  });
(function(global){
	var dc={};
	var indexUrl = "snippets/index-snippet.html";

	var allCategoriesUrl="https://davids-restaurant.herokuapp.com/categories.json";
	var categoryTitleHtml="snippets/category-title-snippet.html";
	var categoryHtml="snippets/category-snippet.html"
    
    var switchActive=function(selector){
    	html=document.querySelector("#mytarget").innerHTML;
    	html=html.replace(new RegExp("active","g"),"");
    	document.querySelector("#mytarget").innerHTML=html;
    	document.querySelector(selector).className+=" active";
    };
	var insertHtml = function(selector,html){
		document.querySelector(selector).innerHTML=html;
	}
	var showLoading = function(selector){
		var html="<div class='text-center'><img src='images/ajax-loader.gif' alt='loading'></div> ";
		insertHtml(selector,html);
	};
	document.addEventListener("DOMContentLoaded",
		function(event){
            $ajaxutil.sendRequest(indexUrl,function(responseText){
            	switchActive("#home");
            document.querySelector("#main-content").innerHTML=responseText;
           
           },false)

		});
	var insertProperty=function(html,propName,propValue){
		 if(!propValue){
		 	propValue="";
		 }
		var toReplace = "{{"+propName+"}}";
		html = html.replace(new RegExp(toReplace,"g"),propValue);
		return html;
    };
    dc.loadMenuCategories=function(){
    	showLoading("#main-content");
    	switchActive("#menu");
    	$ajaxutil.sendRequest(allCategoriesUrl,buildAndShowCategoriesHTML);
    };
    var buildAndShowCategoriesHTML=function(categories){
     $ajaxutil.sendRequest(categoryTitleHtml,function(categoryTitleHtml){
       $ajaxutil.sendRequest(categoryHtml,function(categoryHtml){
       	var categoriesViewHtml = buildCategoriesViewHtml(categories,categoryTitleHtml,categoryHtml);
       	document.querySelector("#main-content").innerHTML=categoriesViewHtml;
       },false);
     },false);
    };
    function buildCategoriesViewHtml(categories,categoryTitleHtml,categoryHtml){
    	finalHtml=categoryTitleHtml+"<section class='row'>";
    	for(var i=0;i<categories.length;i++){
    		var html=categoryHtml;
    		var name=categories[i].name;
    		var short_name=categories[i].short_name;
    		var html=insertProperty(html,"name",name);
    		var html=insertProperty(html,"short_name",short_name);
    		finalHtml+=html;
    	}
    	finalHtml+="</Section>";
    	return finalHtml;

    };

    var menuItemUrl="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml="snippets/menu-items-title.html";
    var menuItemHtml="snippets/menu-item.html";

    dc.loadMenuItems=function(catShortName){
	showLoading("#main-content");
	$ajaxutil.sendRequest(menuItemUrl+catShortName,buildAndShowMenuItemHtml);
	};
	var buildAndShowMenuItemHtml=function(categoryMenuItem){
		$ajaxutil.sendRequest(menuItemsTitleHtml,function(menuItemsTitleHtml){
			$ajaxutil.sendRequest(menuItemHtml,function(menuItemHtml){
				var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItem,menuItemsTitleHtml,menuItemHtml);
                document.querySelector("#main-content").innerHTML=menuItemsViewHtml;
			},false);
		},false);
	};
	function buildMenuItemsViewHtml(categoryMenuItem,menuItemsTitleHtml,menuItemHtml){
		var finalHtml=menuItemsTitleHtml;		
		finalHtml=insertProperty(finalHtml,"name",categoryMenuItem.category.name);
		finalHtml=insertProperty(finalHtml,"special_instructions",categoryMenuItem.category.special_instructions);
		finalHtml+="<section class='row'>";
        menuItemHtml=insertProperty(menuItemHtml,"catShortName",categoryMenuItem.category.short_name);
		var menuItems=categoryMenuItem.menu_items;
		for(var i=0;i<menuItems.length;i++){
			var html=menuItemHtml;
			html=insertProperty(html,"short_name",menuItems[i].short_name);
			html=insertProperty(html,"name",menuItems[i].name);
			html=insertProperty(html,"description",menuItems[i].description);
			html=insertPrice(html,"price_small",menuItems[i].price_small);
			html=insertPrice(html,"price_large",menuItems[i].price_large);
			html=insertProperty(html,"small_portion_name",menuItems[i].small_portion_name);
			html=insertProperty(html,"large_portion_name",menuItems[i].large_portion_name);
			if(i%2!=0){
				html+="<div class='clearfix visible-md visible-lg'></div>"
			}
			finalHtml+=html;
		}
        finalHtml+="</section>";
        return finalHtml;
	};
	var insertPrice=function(html,propName,propValue){
		if(!propValue){
			return insertProperty(html,propName,propValue);
		}
		else{
			propValue="$"+propValue;
			return insertProperty(html,propName,propValue);
		}
    };
	global.$dc=dc;
})(window);
