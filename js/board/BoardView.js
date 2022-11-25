(function(views)
{
    var self;

    function BoardView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(BoardView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;
				
				$('#content').kinetic({cursor: "auto"});

				$(document).on("login", function ()
                {
					self.presenter.getSettings();
				});
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
				var self = this;
				
				this.settings = data;
				
				if(data == undefined || data.boards == undefined)
				{
					self.showBoardsDialog();
				}
				else
				{
					self.showDefaultBoardsDialog(data.boards);
				}
            },
            enumerable: false
        },
        showDefaultBoardsDialog : {
            value: function(boards)
            {
				var self = this;
				
				this.boards = [];
				
				$(".modal-dialog").load("js/board/default.html", function()
				{
					self.template = $(this);
					
					self.resourcesTemplate = self.template.find(".body li").detach();
					
					var resources = self.template.find(".body");
					
					$.each(boards, function()
					{
						var clone = self.resourcesTemplate.clone();
					
						var img = $("<img/>", {"class": "icon", "data-id": this.id, "data-name": this.name, src: this.icon}).appendTo(clone);
					
						var boardId = this.id;
					
						img.click(function()
						{
							self.dialog[0].close();
							
							var element = self.settings.boards.find(({ id }) => id === boardId);
							
							if(element != undefined)
							{
								$("#logo").attr("src", $(this).attr("src"));
								
								if(element.status_map == undefined || element.status_map.length == 0)
								{
									self.showStatusMapDialog({id: $(this).data("id"), name: $(this).data("name"), icon: $(this).attr("src"), status_map: element.status_map});
								}
								else
								{
									$(document).trigger( "board", {id: $(this).data("id"), name: $(this).data("name"), icon: $(this).attr("src"), status_map: element.status_map});
								}
							}
						})
						
						clone.appendTo(resources);
					});
					
					self.dialog = $(this).find(".board-default-dialog");
				   
					self.dialog[0].showModal();
				});
            },
            enumerable: false
        },
        showStatusMapDialog : {
            value: function(board)
            {
				var self = this;
				
				$(".modal-dialog").load("js/board/statusmaps.html", function()
				{
					self.template = $(this);
					
					self.resourcesTemplate = self.template.find(".body li").detach();
					
					self.dialog = $(this).find(".status-maps-dialog");
					
					self.dialog.find(".name").html(board.name + " " + self.dialog.find(".name").html());
					
					self.dialog.find(".mdl-button.close").click(function()
					{
						self.dialog[0].close();
					});
					
					self.dialog.find(".mdl-button.confirm").click(function()
					{
						self.commitStatusMapBoards(board);
					});
				   
					self.dialog[0].showModal();
					
					self.presenter.getIssueStatus(board);
				});
            },
            enumerable: false
        },
        loadIssueStatus : {
            value: function(board, data)
            {
				var self = this;
				
				var columns = ["todo", "progress", "totest", "done"];

				$.each(columns, function(i)
				{
					var column = this;
					
					var resources = self.template.find(".context-menu-" + this + " > div");
					
					$.each(data, function()
					{
						var clone = self.resourcesTemplate.clone();
						clone.html("<img class='icon' src='" + this.iconUrl + "'/><span class='status_id' data-id='" + this.id + "' data-icon='" + this.iconUrl + "'>" + this.id +"</span>" + this.name);
					
						clone.click(function()
						{
							$(this).toggleClass("active");
							
							var cnt = self.dialog.find(".body .context-menu-item.active").length;
						}).appendTo(resources);
					});
				});
            },
            enumerable: false
        },
        commitStatusMapBoards : {
            value: function(board)
            {
				var self = this;
				
				var element = self.settings.boards.find(({ id }) => id === board.id);
				
				element.status_map = {todo: [], progress: [], totest: [], done: []};
				
                $.each($(this.dialog).find(".body .context-menu-todo .context-menu-item.active"), function()
                {
					element.status_map.todo.push($(this).find(".status_id").data("id"));
                });
				
				$.each($(this.dialog).find(".body .context-menu-progress .context-menu-item.active"), function()
                {
					element.status_map.progress.push($(this).find(".status_id").data("id"));
                });
				
				$.each($(this.dialog).find(".body .context-menu-totest .context-menu-item.active"), function()
                {
					element.status_map.totest.push($(this).find(".status_id").data("id"));
                });
				
				$.each($(this.dialog).find(".body .context-menu-done .context-menu-item.active"), function()
                {
					element.status_map.done.push($(this).find(".status_id").data("id"));
                });
				
				self.presenter.setSetting("boards", self.settings.boards, function(data){
					self.dialog[0].close();
					self.settings = data;
					$(document).trigger( "board", board);
				});
            },
            enumerable: false
        },
        showBoardsDialog : {
            value: function()
            {
				var self = this;
				
				this.boards = [];
				
				$(".modal-dialog").load("js/board/boards.html", function()
				{
					self.template = $(this);
					
					self.resourcesTemplate = self.template.find(".body li").detach();
					
					self.dialog = $(this).find(".board-dialog");
					
					self.dialog.find(".mdl-button.close").click(function()
					{
						self.dialog[0].close();
					});
					
					self.dialog.find(".mdl-button.confirm").click(function()
					{
						self.commitDefaultBoards();
					});
				   
					self.dialog[0].showModal();
					
					self.presenter.getList();
				});
            },
            enumerable: false
        },
        commitDefaultBoards : {
            value: function()
            {
				var self = this;
				
				this.defaultBoards = [];
				
                $.each($(this.dialog).find(".body .context-menu-item.active"), function()
                {
					var statud_id = $(this).find(".status_id");
					
					self.defaultBoards.push({id: statud_id.data("id"), name: statud_id.text(), icon: statud_id.data("icon")});
                });
				
				self.presenter.setSetting("boards", this.defaultBoards, function(data)
				{
					self.dialog[0].close();
					self.settings = data;
					self.showDefaultBoardsDialog(data.boards);
				});
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
				var self = this;
				
				this.boards = this.boards.concat(data.values);
				
                if(data.isLast)
                {
                    var resources = this.template.find(".body");

					$.each(this.boards, function()
					{
						var clone = self.resourcesTemplate.clone();
						clone.html("<img class='icon' src='" + this.location.avatarURI + "'/><span class='status_id' data-id='" + this.id + "' data-icon='" + this.location.avatarURI + "'>" + this.name +"</span>" + this.location.name);
					
						clone.click(function()
						{
							$(this).toggleClass("active");
							
							var cnt = self.dialog.find(".body .context-menu-item.active").length;
							
							self.dialog.find(".selection").html(cnt + " elements selected");
						}).appendTo(resources);
					});
                }
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

    views.BoardView = BoardView;
})(viewer.views);