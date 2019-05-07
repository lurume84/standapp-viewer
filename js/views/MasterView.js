(function(views)
{
    var self;

    function MasterView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(MasterView.prototype,
    {
        init : {
            value: function()
            {
                
            },
            enumerable: false
        },
        createUser : {
            value: function(user)
            {
                var element = $("#" + user.key + "_user");

                if(element.length == 0)
                {
                    element = $("<li/>", {id: user.key + "_user", "data-name" : user.displayName});
					
                    $("<div/>", {class: "worklog"}).appendTo(element);

                    $("<img/>", {src: user.avatarUrls["48x48"]}).appendTo(element);

					element.appendTo($("#right_panel > ul"));
                }

                return element;
            },
            enumerable: false
        },
        load : {
            value: function(boardId)
            {
				var user = this.createUser(g_master);
				
				var burndown_path = credentials.domain + "/plugins/servlet/gadgets/ifr?country=US&lang=en&view=default&up_isConfigured=true&up_rapidViewId=" + boardId + "&up_showRapidViewName=false&" + 
									"up_sprintId=auto&up_refresh=15&url=" + 
									escape(credentials.domain) + 
									"%2Frest%2Fgadgets%2F1.0%2Fg%2Fcom.pyxis.greenhopper.jira%3Agreenhopper-gadget-sprint-burndown%2Fgadgets%2Fgreenhopper-sprint-burndown.xml";

				var height = Math.min(($("body").width() - $("#right_panel").width()) * 0.50, $("body").height() * 0.9);
				
				var width =  height * 1.7;
				
				var burndown = $("<div/>", {class: "burndown_container", style: "width: " + width + "px;"}).appendTo(user.children(".worklog"));
				$("<iframe/>", {src: burndown_path, scrolling: "no", frameborder: "no", style: "width: " + width + "px;height: " + height + "px;"}).appendTo(burndown);
            },
            enumerable: false
        },

        showError : {
            value: function(data)
            {
                console.log(data);
            },
            enumerable: false
        }
    });

    views.MasterView = MasterView;
})(standapp.views);