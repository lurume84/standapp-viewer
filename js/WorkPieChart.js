(function(helpers)
{
    var self;

    function WorkPieChart(user)
    {
        this.user = user;
		
		this.colors = ["#2196F3", "#E91E63", "#8BC34A", "#673AB7", "#FF5722", "#FFC107", "#F44336", 
							  "#009688", "#4CAF50", "#9C27B0", "#CDDC39", "#FFEB3B", "#FF9800", 
							  "#FF5722", "#795548", "#607D8B"];
    }

    Object.defineProperties(WorkPieChart.prototype,
    {
        init : {
            value: function(worklog)
            {
				self = this;
				
				this.tasks_container = $("<div/>", {class:"tasks"}).kinetic({cursor: "auto"}).appendTo(worklog);
                this.pies_container = $("<div/>", {class:"pies"}).appendTo(worklog);
                
				this.issues = [];
				
                worklog.data("pie", this);
            },
            enumerable: false
        },
        createPieChart : {
            value: function(parent, title, data)
            {
				parent.children("canvas").remove();
				var canvas = $("<canvas/>").appendTo(parent);
				
				var heightCorrection = 11;
				
                return new Chart(canvas[0].getContext("2d"),
				{
					type: 'pie',
					data: data,
					options: {
						title:{
							display:false,
							fontSize: 16,
							fontStyle: "normal",
							fontFamily: "Helvetica",
							text: title
						},
						legend: {
							display:false
						},
						tooltips: {
							mode: 'index',
							intersect: true
						},
						responsive: true,
						responsiveAnimationDuration: 1000,
						maintainAspectRatio: false,
						scales: {
							xAxes: [{
								display: false,
								ticks: { display: false},
								gridLines: { display: false}
							}],
							yAxes: [{
								display: false,
								ticks: { display: false},
								gridLines: { display: false}
							}]
						}, 
						hover: {
							animationDuration: 0
						},
						animation: 
						{
							duration: 1000,
							onComplete: function()
							{
								var chartInstance = this.chart;
								var ctx = chartInstance.ctx;

								var self = this;
								ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
								ctx.textAlign = 'center';
								ctx.fillStyle = '#fff';

								Chart.helpers.each(self.data.datasets.forEach(function (dataset, datasetIndex)
								{
									var meta = self.getDatasetMeta(datasetIndex);
									var total = 0; //total values to compute fraction
									var labelxy = [];
									var offset = Math.PI / 2; //start sector from top
									var radius, centerx, centery; 
									var lastend = 0; //prev arc's end line: starting with 0

									for (var val of dataset.data)
									{ 
										total += val; 
									} 

									Chart.helpers.each(meta.data.forEach( function (element, index)
									{
										radius = 0.9 * element._model.outerRadius - element._model.innerRadius;
										centerx = element._model.x;
										centery = element._model.y + heightCorrection;
										
										var thispart = dataset.data[index];
										var arcsector = Math.PI * (2 * thispart / total);
											
										if (element.hasValue() && dataset.data[index] > 0)
										{
										  labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
										}
										else
										{
										  labelxy.push(-1);
										}
										
										lastend += arcsector;
									}), self)

									var lradius = radius * 3 / 4;
									for (var idx in labelxy)
									{
										if (labelxy[idx] === -1) continue;

										var langle = labelxy[idx];
										var dx = centerx + lradius * Math.cos(langle);
										var dy = centery + lradius * Math.sin(langle);

										ctx.fillText(round(dataset.data[idx], 2) + 'h', dx, dy);
									}
									
									heightCorrection = 0;

								}), self);
							}
						}
					}  
				});
            },
            enumerable: false
        },
        createBarChart : {
            value: function(parent, data)
            {
				parent.children("canvas").remove();
                var canvas = $("<canvas/>").appendTo(parent);
			
				var maxScaleX = Math.max(data.datasets[0].data[0], data.datasets[1].data[0] + data.datasets[2].data[0]);
				
				return new Chart(canvas[0].getContext("2d"),
				{
					type: 'horizontalBar',
					data: data,
					options: {
						legend: 
						{
							display:false
						},
						tooltips: {
							mode: 'index',
							intersect: true
						},
						responsive: true,
						responsiveAnimationDuration: 1000,
						maintainAspectRatio: false,
						scales: {
							xAxes: [{
								display: false,
								stacked: true,
								ticks: { display: false, max: maxScaleX},
								gridLines: { display: false}
							}],
							yAxes: [{
								display: false,
								stacked: true,
								gridLines: { display: false}
							}]
						}, 
						hover: {
							animationDuration: 0
						},
						animation: 
						{
							duration: 1000,
							onComplete: function()
							{
								var chartInstance = this.chart;
								var ctx = chartInstance.ctx;
								
								ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
								ctx.textAlign = 'center';
								ctx.fillStyle = '#fff';
								ctx.textBaseline = 'top';

								this.data.datasets.forEach(function (dataset, i)
								{
									var meta = chartInstance.controller.getDatasetMeta(i);
									
									meta.data.forEach(function (bar, index)
									{
										var data = dataset.data[index];
										var x =  bar._model.base + (bar._model.x - bar._model.base) * 0.5;
										
										if(data > 0)
										{
											ctx.fillText(data + "h", x, bar._model.y - 7);
										}
									});
								});
							}
						}}  
				});
            },
            enumerable: false
        },
        addWorkLog : {
            value: function(issue, created, seconds)
            {
                created = moment(created);

                var today = moment().startOf('day');

                if(!created.isSame(today, 'd') && ( this.lastDay == undefined || 
                                                    this.lastDay.diff(created) < 0 || 
                                                    created.isSame(this.lastDay, 'd')))
                {
                    this.lastDay = created;
                }

                this.append(created, issue, seconds);
            },
            enumerable: false
        },
        append : {
            value: function(date, issue, seconds)
            {
                date = date.format('YYYY-MM-DD');
                
                if(this.issues[issue.key] == undefined)
                {
                    this.issues[issue.key] = {issue: issue, dates: []};
                }

                if(this.issues[issue.key].dates[date] == undefined)
                {
                    this.issues[issue.key].dates[date] = {seconds: 0};
                }

                this.issues[issue.key].dates[date].seconds += seconds / 3600;
            },
            enumerable: false
        },
        renderPie : {
            value: function(parent, container, today, lastDay)
            {
                var data =
				{
					labels: [],
					datasets: [{
						backgroundColor: [],
						data: []
					}]
				};

				var i = 0;
				for(var key in this.issues)
				{
					var element = this.issues[key];
					
					if((element.issue.fields.issuetype.subtask && element.issue.fields.parent.key == parent && (element.dates[today.format('YYYY-MM-DD')] != undefined || element.dates[lastDay.format('YYYY-MM-DD')] != undefined )))
					{
						data.labels.push(element.issue.key);
						data.datasets[0].backgroundColor.push(this.colors[i]);
						data.datasets[0].data.push(0);
						
						if(lastDay != undefined)
						{
							var lastDayElement = element.dates[lastDay.format('YYYY-MM-DD')];
							if(lastDayElement != undefined)
							{
								data.datasets[0].data[data.datasets[0].data.length - 1] += round(lastDayElement.seconds, 2);
							}
						}
						var todayElement = element.dates[today.format('YYYY-MM-DD')];
						if(todayElement != undefined)
						{
							data.datasets[0].data[data.datasets[0].data.length - 1] += round(todayElement.seconds, 2);
						}
						
						++i;
					}
				}

				this.createPieChart(container, "Logged work", data);
            },
            enumerable: false
        },
        renderBar : {
            value: function(issue, container)
            {
				var barChartData =
				{
					labels: [],
					datasets: [{
						label: 'Original',
						backgroundColor: "#89AFD7",
						stack: 'Stack 0',
						data: []
					}, {
						label: 'Logged',
						backgroundColor: "#51A825",
						stack: 'Stack 1',
						data: []
					}, {
						label: 'Remaining',
						backgroundColor: "#EC8E00",
						stack: 'Stack 1',
						data: []
					}]
				};
				
				var original = (issue.fields.timetracking.originalEstimateSeconds || 0 ) / 3600;
				var remaining = (issue.fields.timetracking.remainingEstimateSeconds || 0 ) / 3600;
				var logged = (issue.fields.timetracking.timeSpentSeconds || 0 ) / 3600;
				
				barChartData.labels.push(issue.key);
				barChartData.datasets[0].data.push(Math.ceil(original));
				barChartData.datasets[1].data.push(Math.ceil(logged));
				barChartData.datasets[2].data.push(Math.ceil(remaining));
				
				return this.createBarChart(container, barChartData);
            },
            enumerable: false
        },
		renderInfo : {
            value: function(parent, container, today, lastDay)
            {
				var i = 0;
				for(var key in this.issues)
				{
					var element = this.issues[key];
					
					if((element.issue.fields.issuetype.subtask && element.issue.fields.parent.key == parent && 
						(element.dates[today.format('YYYY-MM-DD')] != undefined || element.dates[lastDay.format('YYYY-MM-DD')] != undefined )))
					{
						var base = $("#" + element.issue.key).clone();

						if(base.length > 0)
						{
							if(element.issue.fields.assignee == undefined || this.user != element.issue.fields.assignee.key)
							{
								base.addClass("not_assigned_to_me");
							}
							
							var legend_container = $("<div/>");
							var legend = $("<div/>", {class: "legend", "style": "background-color: " + this.colors[i]});
							
							legend.appendTo(legend_container);
							
							base.find(".progress").remove();
							
							var progress = $("<div/>", {class: "progress"});
							progress.appendTo(base);
							
							var task_container = $("<div/>");
							
							legend_container.appendTo(task_container);
							base.appendTo(task_container);
							
							task_container.appendTo(container);
							
							this.renderBar(element.issue, progress);
						}
						
						i++;
					}
				}
            },
            enumerable: false
        },
		renderTasks : {
            value: function(today, lastDay)
            {
				this.tasks_container.html("");
				var container = $("<ul/>").appendTo(this.tasks_container);
				
				for(var key in this.issues)
				{
					var element = this.issues[key];
					
					if((element.dates[today.format('YYYY-MM-DD')] != undefined || element.dates[lastDay.format('YYYY-MM-DD')] != undefined ))
					{
						if(element.issue.fields.issuetype.subtask)
						{
							var us = container.find("li." + element.issue.fields.parent.key);
							
							if(us.length == 0)
							{
								var card = $("<div/>", {class: "demo-card-wide mdl-card mdl-shadow--2dp"});
								
								var usCard = card.clone();
								
								us = $("<li/>", {class: element.issue.fields.parent.key}).appendTo(container)
									
								var base = $("#" + element.issue.fields.parent.key);
							
								if(base.length != 0)
								{
									var clone = base.children("li.user_story").clone();
									
									clone.appendTo(usCard);
									
									clone = base.children("li.todo").clone().kinetic({cursor: "auto"});
									
									var usertype = "";
									
									if(g_dev_users.indexOf(this.user) > -1)
									{
										clone.children("li.qa").remove();
										usertype = "dev";
									}
									
									if(g_qa_users.indexOf(this.user) > -1)
									{
										clone.children("li.dev").remove();
										usertype = "qa";
									}
									
									if(clone.children("li").length == 0)
									{
										clone.append("<span class='info'>No pending " + usertype + " work</span>")
									}
									
									clone.appendTo(usCard);
								}
								
								usCard.appendTo(us);
								
								//work
								
								var workCard = card.clone();
								workCard.addClass("work");
								workCard.appendTo(us);
								
								this.renderPie(element.issue.fields.parent.key, workCard, moment().startOf('day'), this.lastDay);

								//info
								var infoCard = card.clone().kinetic({cursor: "auto"});
								infoCard.addClass("info");
								infoCard.appendTo(us);
								
								this.renderInfo(element.issue.fields.parent.key, infoCard, moment().startOf('day'), this.lastDay);
							}
						}
					}
				}
            },
            enumerable: false
        },
        show : {
            value: function(data)
            {
				this.renderTasks(moment().startOf('day'), this.lastDay);
            },
            enumerable: false
        }
    });

    helpers.WorkPieChart = WorkPieChart;
})(viewer.helpers);