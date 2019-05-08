(function(views)
{
    var self;

    function WorkView(presenter)
    {
        this.presenter = presenter;
		this.audio = new Audio('audio/timeout_full.mp3');
		this.audio.loop = true;
    }

    Object.defineProperties(WorkView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $("#start_standup").off("click").on("click", function()
                {
                    $("#standup").addClass("running");
                    $("#stop_standup").show();
                    $("#next_standup").show();
                    $("#countdown").show();
					$("#right_panel").show();
					$(".clock-container").show();
                    $("#right_panel ul.users > li:first-child").css({marginLeft : "131px"});
                    $("#localVideo").show();
					$(this).hide();
					
                    self.nextUser();
                });

                $("#next_standup").off("click").on("click", function()
                {
					$("#countdown .chart").data("easyPieChart").options.onContinue = function(){return false;};
					$("#countdown .chart").data("easyPieChart").options.onStop();
                });

                $("#pause_standup").off("click").on("click", function()
                {
                    if($("#standup").hasClass("paused"))
                    {
                        $("#standup").removeClass("paused");
                        $(this).children().html("pause");

                        $("#countdown .chart").data("easyPieChart").options.animate.duration = self.currentCounterValues.duration;
                        $("#countdown .chart").data("easyPieChart").update(0, self.currentCounterValues.from)
                        $("#next_standup").show();
                    }
                    else
                    {
                        $("#standup").addClass("paused");
                        $(this).children().html("play_arrow");
                        $("#next_standup").hide();
                    }
                });

                $("#stop_standup").off("click").on("click", function()
                {
                    self.stop();
                });
				
				showDigitalClock();
				
				$('#right_panel > .date').html(moment().format("dddd, D MMMM"));
				
				$('#right_panel ul.users').kinetic({cursor: "auto"});
            },
            enumerable: false
        },

        stop : {
            value: function()
            {
                if($("#standup").hasClass("paused"))
                {
                    $("#standup").removeClass("paused");
                    $("#pause_standup").children().html("pause");
                }
				
				this.audio.pause();
				this.audio.currentTime = 0;

                $("#standup").removeClass("running");
                $("#pause_standup").hide();
                $("#countdown").hide();
                $("#stop_standup").hide();
                $("#next_standup").hide();
				$("#right_panel").hide();
				$(".clock-container").hide();
				$("#start_standup").show();
                $("#localVideo").hide();

                $("#right_panel ul.users").children().removeClass("completed");

                $("#countdown .chart").removeData("easyPieChart").html("");
                $("#countdown .text").html("");

                $(".worklog").hide();
            },
            enumerable: false
        },

        nextUser : {
            value: function()
            {
                var self = this;
                
                var next = $("#right_panel ul.users").children(":not(.completed)").first();

                if(next.length)
                {
					this.audio.pause();
					this.audio.currentTime = 0;
				
                    $(".worklog").hide();
                    
                    $("#countdown .chart").removeData("easyPieChart").html("");

                    $("#right_panel ul.users").children(".completed").children("img").css({width: '32px', height: '32px', "border-radius": "16px"});
                    
                    $("#right_panel ul.users li:first-child").animate({marginLeft: '-=62px'}, 600, "swing", function()
                    {
                        next.addClass("completed");
                    });
                    
                    next.children("img").animate({width: '48px', height: '48px', "border-radius": "24px"}, 600);
                    
					var userId = next.attr("data-user");
										
					var userName = next.attr("data-name");					
					if(userName.indexOf(" ") > -1)
					{
						userName = userName.substring(0, userName.indexOf(" "));
					}
					
					$("#countdown .user").html(userName);
					
					$("#next_standup").hide();
					$("#pause_standup").hide();
					
                    next.children(".worklog").show();
					
					if(next.children(".worklog").data("pie"))
					{
						next.children(".worklog").data("pie").show();
					}
                    
					self.onLastFiveSeconds = function()
					{
						$("#pause_standup").show();
						self.audio.play();
						self.onLastFiveSeconds = undefined;
					};
					
                    $("#countdown .chart").easyPieChart(
                    {
                        scaleColor: false,
                        trackColor: 'rgba(255,255,255,0.3)',
                        barColor: '#C5CBE9',
                        lineWidth: 6,
                        lineCap: 'butt',
                        size: 95,
                        onContinue: function()
                        {
                            return $("#standup").hasClass("running") && !($("#standup").hasClass("paused"));
                        },
                        onStop: function()
                        {
                            this.options.onStop = function()
                            {
                                $("#countdown .text").html("");
                                self.nextUser();
                            };

                            this.options.onStep = function(from, to, currentValue)
                            {
                                var duration = (currentValue / 100) * g_seconds_per_user;

								if(duration < 5)
								{
									if(self.onLastFiveSeconds != undefined)
									{
										self.onLastFiveSeconds();
									}
								}
								
                                $("#countdown .text").html(Math.round(duration));
                                self.currentCounterValues = {from: currentValue, duration: duration * 1000}; 
                            };

                            this.options.easing = function(x, t, b, c, d){return c*t/d + b;};
                            this.options.animate.duration = g_seconds_per_user * 1000;
                            this.update(0);
							
							$("#next_standup").show();
                        }
                    });
                }
                else
                {
                    self.stop();
                }
            },
            enumerable: false
        },		
        createUser : {
            value: function(user)
            {
                var element = $("#" + user.key + "_user");

                if(element.length == 0)
                {
                    element = $("<li/>", {id: user.key + "_user", "data-name" : user.displayName, "data-user": user.key});
					
                    var worklog = $("<div/>", {class: "worklog"}).appendTo(element);

                    var pie = new standapp.helpers.WorkPieChart(user.key);
                    pie.init(worklog);

                    $("<img/>", {src: user.avatarUrls["48x48"]}).appendTo(element);

					if(g_dev_users.indexOf(user.key) > -1)
					{
						element.prependTo($("#right_panel .users"));
					}
                    else
					{
						element.appendTo($("#right_panel .users"));
					}
                }

                return element;
            },
            enumerable: false
        },
        load : {
            value: function(boardId, data)
            {
                var self = this;

                $("#right_panel ul.users").html("");

                $.each( data.issues, function( key, issue )
                {
                    if(issue.fields.assignee != undefined)
					{
                        var user = self.createUser(issue.fields.assignee);
						
						var status = g_status_map[issue.fields.status.id];
						
						if(!issue.fields.worklog.worklogs.length)
						{
							if(status != "rejected")
							{
								user.children(".worklog").data("pie").addWorkLog(issue, new Date(), 0);
							}
							else
							{
								user.children(".worklog").data("pie").addWorkLog(issue, issue.fields.updated, 0);
							}
						}
                    }

                    $.each( issue.fields.worklog.worklogs, function( key2, worklog )
                    {
                        var user = self.createUser(worklog.author);

                        user.children(".worklog").data("pie").addWorkLog(issue, worklog.created, worklog.timeSpentSeconds);
                    });
                });
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

    views.WorkView = WorkView;
})(standapp.views);