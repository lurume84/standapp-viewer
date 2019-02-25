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

                $("#sprintList").change(function ()
                {
					$("#content").html("");
					$('#standup > #right_panel > ul').html("");
					$("#loading").show();
					$("#start_standup").hide();
					
                    self.presenter.getList($("#boardList").val(), $(this).val());
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                var completed_user_stories = [];

                $.each( data.issues, function( key, issue )
                {
                    var issueType = g_issuetype_map.user_story[issue.fields.issuetype.id];
                    var status = g_status_map[issue.fields.status.id];

                    if(issueType != undefined)
                    {
                        var estimate = "";
                        if(issue.fields[g_estimate_field])
                        {
                            estimate = "<div class=\"estimate\">" + issue.fields[g_estimate_field] + "</div>";
                        }

                        var numberClass = "";
                        if(status == "done")
                        {
                            numberClass = "completed";
                        }

                        var us = $("<ul/>", {id: issue.key});
                        
						var user_story = $("<li/>", {class: "user_story"}).append("<img class=\"issuetype\" src=\"" + issue.fields.issuetype.iconUrl + "\"/>" +
                                        estimate +
                                        "<a class=\"number " + numberClass +"\" href=\"#\">" + issue.key +"</a>" +
                                        "<img class=\"priority\" src=\"" + issue.fields.priority.iconUrl + "\"/>" +
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
})(alba.views);