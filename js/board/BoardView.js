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
				
				if(data == undefined || data.boards == undefined)
				{
					self.showBoardsDialog();
				}
				else
				{
					self.showDefaultDialog(data.boards);
				}
            },
            enumerable: false
        },
        showDefaultDialog : {
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
					
						img.click(function()
						{
							self.dialog[0].close();
							
							$("#logo").attr("src", $(this).attr("src"));
							
							$(document).trigger( "board", {id: $(this).data("id"), name: $(this).data("name"), icon: $(this).attr("src")});
						})
						
						clone.appendTo(resources);
					});
					
					self.dialog = $(this).find(".board-default-dialog");
				   
					self.dialog[0].showModal();
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
						self.commit();
					});
				   
					self.dialog[0].showModal();
					
					self.presenter.getList();
				});
            },
            enumerable: false
        },
        commit : {
            value: function()
            {
				var self = this;
				
				this.defaultBoards = [];
				
                $.each($(this.dialog).find(".body .context-menu-item.active"), function()
                {
					var statud_id = $(this).find(".status_id");
					
					self.defaultBoards.push({id: statud_id.data("id"), name: statud_id.text(), icon: statud_id.data("icon")});
                });
				
				self.presenter.setSetting("boards", this.defaultBoards);
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
        onSaveSetting : {
            value: function(data)
            {
                this.dialog[0].close();
				
				this.showDefaultDialog(data.boards);
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