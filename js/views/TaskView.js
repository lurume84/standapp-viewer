(function(views)
{
    var self;

    function TaskView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(TaskView.prototype,
    {
        init : {
            value: function()
            {

            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                $.each( data.issues, function( key, issue )
                {
                    var issueType = g_issuetype_map.task[issue.fields.issuetype.id];
                   
                    if(issueType != undefined && issue.fields.issuetype.subtask)
                    {
                       var parent = $("#" + issue.fields.parent.key);

                       if(parent.length)
                       {
                           var assignee = "";
						   
							if(issue.fields.assignee != undefined)
							{
								assignee =  "<div class='assignee'>" +
											"   <img id=\"" + issue.key + "_avatar\" src='" + issue.fields.assignee.avatarUrls["32x32"] + "'>" +
											"   <div class=\"mdl-tooltip\" data-mdl-for=\"" + issue.key + "_avatar\">" + issue.fields.assignee.name + "</div>" +
											"</div>";
							}

                            var task = $("<li/>",
                            {
                                id: issue.key, 
                                class: "task " + issueType,
                                html:   assignee +
                                        "<a class='number'>" + issue.key + "</a>" +
                                        "<div class=\"mdl-tooltip\" data-mdl-for=\"" + issue.key + "_link\">" + issue.fields.summary + "</div>" +
                                        "<div id=\"" + issue.key + "_link\" class=\"title\">" + issue.fields.summary + "</div>"
                            });

                            $("<div/>", {class: "progress mdl-progress mdl-js-progress"}).on('mdl-componentupgraded', function() {
                                this.MaterialProgress.setProgress(issue.fields.progress.percent);
                            }).appendTo(task);

                            var status = g_status_map[issue.fields.status.id];

                            if((status == "test" && issueType == "dev") || status == "rejected")
                            {
                                parent.children(".done").append(task);
                            }
                            else
                            {
                                var target = parent.children("." + status);
								
								target.append(task);
								
								if(target.children("li").length > 4 && !target.hasClass("kinetic-active"))
								{
									target.kinetic({cursor: "auto"});
								}
                            }
                       }
                   }
                });

				$("#loading").hide();
				$("#start_standup").show();
				
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

    views.TaskView = TaskView;
})(viewer.views);