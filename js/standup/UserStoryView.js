(function(views)
{
    var self;

    function UserStoryView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(UserStoryView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

				$(document).on("board", function (evt, data)
                {
                    self.board = data;
                });

                $(document).on("sprint", function (evt, data)
                {
					$("#content").html("");
					$("#standup > #right_panel ul.users").html("");
					$("#standup > #right_panel .users").html("");
					$("#loading").show();
					$("#start_standup").hide();
					
                    self.presenter.getList(self.board, data.id);
                });
            },
            enumerable: false
        },

        load : {
            value: function(board, data)
            {
                var completed_user_stories = [];

				$(document).trigger("issues", data);

                $.each( data.issues, function( key, issue )
                {	
                    if(!issue.fields.issuetype.subtask)
                    {
                        var estimate = "";
                        if(issue.fields[g_estimate_field])
                        {
                            estimate = "<div class=\"estimate\">" + issue.fields[g_estimate_field] + "</div>";
                        }

                        var numberClass = "";
						
						var status = getStatus(board, issue.fields.status.id);
						
                        if(status == "done")
                        {
                            numberClass = "completed";
                        }

                        var us = $("<ul/>", {id: issue.key});
                        
						var priority = issue.fields.priority ? issue.fields.priority.iconUrl : "";
						
						var user_story = $("<li/>", {class: "user_story"}).append("<img class=\"issuetype\" src=\"" + issue.fields.issuetype.iconUrl + "\"/>" +
                                        estimate +
                                        "<a class=\"number " + numberClass +"\" href=\"#\">" + issue.key +"</a>" +
                                        "<img class=\"priority\" src=\"" + priority + "\"/>" +
                                        "<p class=\"title\">" + issue.fields.summary + "</p>").appendTo(us);
						

						$("<div/>", {class: "progress mdl-progress mdl-js-progress"}).on('mdl-componentupgraded', function() {
                                this.MaterialProgress.setProgress(issue.fields.aggregateprogress.percent);
                            }).appendTo(user_story);

						
						$("<li/>", {class: "todo", html: "<ul></ul>"}).appendTo(us);
						$("<li/>", {class: "progress", html: "<ul></ul>"}).appendTo(us);
						$("<li/>", {class: "test", html: "<ul></ul>"}).appendTo(us);
						$("<li/>", {class: "done", html: "<ul></ul>"}).appendTo(us);
						$("<li/>", {class: "rejected", html: "<ul></ul>"}).appendTo(us);
	
                        if(status == "done")
                        {
                            completed_user_stories.push(us);
                        }
                        else
                        {
                            us.appendTo($("#content"));
                        }
                   }
                });

				$.each( completed_user_stories, function( key, item )
                {
					item.appendTo($("#content"));
				});
				
				componentHandler.upgradeAllRegistered();
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

    views.UserStoryView = UserStoryView;
})(viewer.views);