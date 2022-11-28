(function(views)
{
    var self;

    function BurndownView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(BurndownView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                this.issues = [];
                this.resources = {};
				
				self.container = $("<div/>", {class: "burndown_container"});
				
				var chart = $("<div/>", {class: "chart", style: ""}).appendTo(self.container);
				$("<canvas/>", {id: "myChart", style: ""}).appendTo(chart);
				$("<div/>", {class: "estimate_resources"}).appendTo(self.container);
				
				$(document).on("board", function (evt, data)
                {
                    self.board = data;
                });
				
				$(document).on("sprint", function (evt, data)
                {
                    self.sprint = data;
					self.sprint.name = self.sprint.name.replace(/ /g, '_');
					
					self.onSprint(self.sprint);
					
					self.presenter.load(self.board.name, self.sprint.name);
                });
				
				$(document).on("issues", function (evt, data)
                {
                    self.issues = data.issues;
                });
				
				$(document).on("master", function (evt, data)
                {
                    self.container.appendTo($(data));
					
					self.onSubtasks(self.issues);
                });
            },
            enumerable: false
        },
        onSubtask : {
            value: function(data)
            {
                var self = this;
               
                if(data.fields.timetracking.originalEstimateSeconds > 0)
                {
                    var table = $("table.burndown");
                    
                    var tbody = table.find("#" + data.fields.parent.key);
                    
                    if(tbody.length == 0)
                    {
                        tbody = $("<tbody/>", {id: data.fields.parent.key});
                        tbody.appendTo(table);
                        
                        $("<tbody/>", {html: "<tr/>"}).appendTo(table);
                    }
                
                    var row = $("<tr/>");
                    
                    var estimate = data.fields.timetracking.originalEstimateSeconds / 3600;
                    
                    $("<td/>", {html: data.fields.parent.key}).appendTo(row);
                    $("<td/>", {html: data.fields.issuetype.name}).appendTo(row);
                    $("<td/>", {html: data.key}).appendTo(row);
                    $("<td/>", {html: data.fields.summary}).appendTo(row);
                    $("<td/>", {html: estimate}).appendTo(row);
                    $("<td/>", {html: ""}).appendTo(row);
                   
                    var changes = new Array(self.workingDays.length);
                    var backgrounds = new Array(self.workingDays.length);
                    
                    changes.fill(estimate);
                    //backgrounds.fill("#fff");

					var dataSet = self.chartData.datasets.find(({ label }) => label === data.fields.issuetype.name);
					var dataSetEstimate = self.chartData.datasets.find(({ label }) => label === data.fields.issuetype.name + " Estimate");
					
					if(!dataSet)
					{
						dataSet = {
						  label: data.fields.issuetype.name,
						  fill: false,
						  backgroundColor: "#fff",
						  borderColor: self.getColor(self.chartData.datasets.length),
						  data: new Array(self.workingDays.length),
						  cubicInterpolationMode: 'monotone',
						  tension: 0.4
						};
						
						dataSet.data.fill(0);
						
						self.chartData.datasets.push(dataSet);
						
						dataSetEstimate = {
						  label: data.fields.issuetype.name + " Estimate",
						  fill: false,
						  backgroundColor: "#fff",
						  borderColor: self.getColor(self.chartData.datasets.length),
						  data: new Array(self.workingDays.length),
						  originalData: new Array(self.workingDays.length),
						  borderDash: [5, 5],
						  workers: []
						};
						
						dataSetEstimate.data.fill(0);
						dataSetEstimate.originalData.fill(0);
						
						self.chartData.datasets.push(dataSetEstimate);
						
						self.myChart.update();
						
						if(self.resources[data.fields.issuetype.name] == undefined)
						{
							self.resources[data.fields.issuetype.name] = {};
						}
						
						self.createEstimateResources(data.fields.issuetype.name, dataSetEstimate.borderColor );
					}

                    $.each([...data.changelog.histories].reverse(), function(i)
                    {
                        var date = moment(this.created);
                        
                        var index = self.workingDays.findIndex((element) => element == date.format('DD/MM/YYYY'));
                        
                        if(index > -1)
                        {
							var author = this.author;
                            $.each(this.items, function(j)
                            {
                                if(this.field == "timeestimate")
                                {
                                    var from = Math.ceil(parseInt(this.from || 0) / 3600);
                                    var to = Math.ceil(parseInt(this.to || 0) / 3600);
                                    
                                    changes.fill(to, index);
                                }
                                else if(this.field == "status" && this.to == 10706)
                                {
                                    backgrounds[index] = "#0f0";
                                }
								
								else if(this.field == "timespent")
                                {
                                    if(dataSetEstimate.workers.findIndex(({ accountId }) => accountId == author.accountId) < 0)
									{
										dataSetEstimate.workers.push(author);
									}
                                }
                            });
                        }
                    });
                    
                    var index = self.workingDays.findIndex((element) => element == moment().format('DD/MM/YYYY'));
                    
                    if(index > -1)
                    {
                        changes.fill("", index + 1);
                    }
                    
                    $.each(self.workingDays, function(i)
                    {
                        var value = changes[i];
                        var background = backgrounds[i];
						
						dataSet.data[i] += changes[i];
						dataSetEstimate.data[i] += estimate;
						dataSetEstimate.originalData[i] += estimate;
						
                        $("<td/>", {html: value, style: "background-color: " + background }).appendTo(row);
                    });
					
					self.myChart.update();
                    
                    row.appendTo(tbody);
                }
            },
            enumerable: false
        },
        onSubtasks : {
            value: function(issues)
            {
                var self = this;
                
                $.each(issues, function()
                {
                    self.onSubtask(this);
                });
				
				var dataSets = self.chartData.datasets.filter(({ label }) => label.slice(label.length-9,label.length) != " Estimate");
				
				var todayIndex = self.workingDays.findIndex((element) => element == moment().format('DD/MM/YYYY'));
				
				var cnt = 1;
				
				while(todayIndex < 0 && cnt < self.workingDays.length)
				{
					var date = moment().subtract(cnt++, "days").format('DD/MM/YYYY');
					todayIndex = self.workingDays.findIndex((element) => element == date);
				}
				
				$.each(dataSets, function(j)
				{
					dataSets[j].data = dataSets[j].data.slice(0, todayIndex);
				});
				
				self.myChart.update();
				
				self.computeEstimate();
            },
            enumerable: false
        },
        computeEstimate : {
            value: function()
            {
				var self = this;
				
                var dataSetsEstimate = self.chartData.datasets.filter(({ label }) => label.slice(label.length-9, label.length) == " Estimate");
				
				$.each(dataSetsEstimate, function(dataset)
				{
					this.data = [...this.originalData];
					this.counter = this.originalData[0];
				});
				
				$.each(self.workingDays, function(i)
				{
					$.each(dataSetsEstimate, function(dataset)
					{
						var numResources = 0;
						
						var resources = self.resources[this.label.slice(0, this.label.length-9)];
						
						if(resources != undefined)
						{
							$.each(resources, function(resource)
							{
								if(this[i] != undefined)
								{
									if(this[i].type == "full")
									{
										++numResources;
									}
									else if(this[i].type == "mid")
									{
										numResources += 0.5;
									}
								}
							});
						}
						
						this.counter -= numResources * 5;
						this.data[i] = this.counter;
						
						if(this.data[i] < 0)
							this.data[i] = 0;
					});
				});
				
				self.myChart.update();
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
                this.settings = data;
            },
            enumerable: false
        },
        calcBusinessDays : {
            value: function(startDate, endDate)
            {
                var day = moment(startDate);
                var businessDays = new Array();

                while (day.isSameOrBefore(endDate,'day'))
                {
                    if (day.day()!=0 && day.day()!=6)
                    {
                        businessDays.push(day.format('DD/MM/YYYY'));
                    }
                    day.add(1,'d');
                }
                
                return businessDays;
            },
            enumerable: false
        },
        onSprint: {
            value: function(data)
            {
                var self = this;
                
                self.workingDays = self.calcBusinessDays(data.startDate, data.endDate);
                        
				var table = $("table.burndown");
				
				var row = $("<tr/>");
				
				$("<th/>", {html: "US"}).appendTo(row);
				$("<th/>", {html: "Type"}).appendTo(row);
				$("<th/>", {html: "Task"}).appendTo(row);
				$("<th/>", {html: "Summary"}).appendTo(row);
				$("<th/>", {html: "Estimated"}).appendTo(row);
				$("<th/>", {html: ""}).appendTo(row);
				
				for(var i = 0; i < self.workingDays.length; ++i)
				{
					$("<th/>", {html: self.workingDays[i].substring(0, self.workingDays[i].indexOf("/"))}).appendTo(row);
				}
				
				row.appendTo(table);
                
                self.setupChart();
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                console.log(data);
            },
            enumerable: false
        },
        setupChart : {
            value: function()
            {
                const DATA_COUNT = 7;
				const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

				const labels = Array.from(this.workingDays, x => moment(x, "DD/MM/YYYY").format("DD/MM"));
				this.chartData = {
				  labels: labels,
				  datasets: []
				};
				
				const config = {
				  type: 'line',
				  data: this.chartData,
				  options: {
					responsive: true,
					plugins: {
					  title: {
						display: true,
						text: 'Burndown'
					  },
					},
					interaction: {
					  mode: 'index',
					  intersect: false
					},
					scales: {
						// xAxes: [{gridLines: { color: "#9e9e9e" }}],
						// yAxes: [{gridLines: { color: "#9e9e9e" }}],
					  x: {
						display: true,
						title: {
						  display: true,
						  text: 'Days'
						}
					  },
					  y: {
						display: true,
						title: {
						  display: true,
						  text: 'Hours'
						}
					  }
					}
				  },
				};
				
				const ctx = this.container.find('#myChart')[0];
				this.myChart = new Chart(ctx, config);
				
            },
            enumerable: false
        },
        onAssignableUsers : {
            value: function(data)
            {
				var self = this;
				
				this.users = [];
				
				var resources = this.template.find(".body");
				
                $.each(data, function()
                {
					if(this.active)
					{
						var clone = self.resourcesTemplate.clone();
						clone.html("<img class='icon' src='" + this.avatarUrls["32x32"] + "' title='" + this.displayName + "'/><span class='status_id'>" + this.displayName +"</span>" + this.emailAddress);
					
						clone.click(function()
						{
							$(this).toggleClass("active");
							var cnt = self.dialog.find(".body .context-menu-item.active").length;
							self.dialog.find(".selection").html(cnt + " elements selected");
						}).appendTo(resources);
					}
                });
            },
            enumerable: false
        },
        getColor : {
            value: function(i)
            {
                var colors = ["#1e88e5", "#90caf9", "#ffb300", "#ffd54f", "#8e24aa", "#ce93d8", "#f4511e", "#ff8a65"];
				
				if(i >= colors.length)
					return colors[0];
				else
					return colors[i];
            },
            enumerable: false
        },
        updateEstimateResources : {
            value: function(task, table)
            {
				var self = this;
				
				table.html("");
				
                $.each(this.resources[task], function(name)
                {
					var tr = $("<tr/>");
				
					$.each(this, function(j)
					{
						var td = $("<td/>");
						
						var className = this.type || "full";
						
						var container = $("<div/>", {class: className}).click(function()
						{
							if($(this).hasClass("full"))
							{
								self.resources[task][name][j].type = "no";
								$(this).removeClass("full").addClass("no");
							}
							else if($(this).hasClass("mid"))
							{
								self.resources[task][name][j].type = "full";
								$(this).removeClass("mid").addClass("full");
							}
							else
							{
								self.resources[task][name][j].type = "mid";
								$(this).removeClass("no").addClass("mid");
							}
							
							self.computeEstimate();
							self.save();
						}).appendTo(td);
					
						$("<img/>", {class: "icon", src: this.src, title: this.name}).appendTo(container);
						
						td.appendTo(tr);
					});
					
					tr.appendTo(table);
                });
            },
            enumerable: false
        },
        createEstimateResources : {
            value: function(name, color)
            {
				var self = this;
				
				var table = $("<table/>", {"class": "assigned ", style: "background-color:" + color}).data("task", name);
				
				var resourceContainer = $("<div/>", {class: "resourceContainer"});
				
				$("<i/>", {class: "iconMenu fas fa-exchange-alt"}).click(function()
                {
					self.showDialog(name, table);
                }).appendTo(resourceContainer);
				
				table.appendTo(resourceContainer);
				
				resourceContainer.appendTo(".burndown_container .estimate_resources");
				
				self.updateEstimateResources(name, table);
            },
            enumerable: false
        },
        onLoad : {
            value: function(data)
            {
				this.resources = data;
				
				this.presenter.getSettings();
            },
            enumerable: false
        },
        showDialog : {
            value: function(task, table)
            {
				var self = this;
				
				$(".modal-dialog").load("js/burndown/resources.html", function()
				{
					self.template = $(this);
					
					self.resourcesTemplate = self.template.find(".body li").detach();
					
					self.dialog = $(this).find(".resource-dialog");
					
					self.dialog.find(".name").html(task + " Resources")
					
					self.dialog.find(".mdl-button.close").click(function()
					{
						self.dialog[0].close();
					});
					
					self.dialog.find(".mdl-button.confirm").click(function()
					{
						self.commit(task, table);
					});
				   
					self.dialog[0].showModal();
					
					self.presenter.getAssignableUsers(self.issues[0].key);
				});
            },
            enumerable: false
        },
        onSave : {
            value: function(data)
            {
				this.computeEstimate();
            },
            enumerable: false
        },
        save : {
            value: function()
            {
				this.presenter.save(this.board.name, this.sprint.name, this.resources);
            },
            enumerable: false
        },
        commit : {
            value: function(task, table)
            {
                var self = this;
                
				table.html("");
				
				var resources = {};
				
                $.each($(this.dialog).find(".body .context-menu-item.active"), function()
                {
					var name = $(this).find(".status_id").text();
					
					resources[name] = new Array();
					
					var element = $(this);
					
					$.each(self.workingDays, function(i)
                    {
                       resources[name].push({name: element.find(".icon").attr("title"), "src": element.find(".icon").attr("src"), "type": "full"});	
                    });
                });
				
				self.resources[task] = resources;
				
				self.updateEstimateResources(task, table);
				self.save();
				
				this.dialog[0].close();
            },
            enumerable: false
        }
    });

    views.BurndownView = BurndownView;
})(viewer.views);