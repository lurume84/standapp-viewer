(function(views)
{
    var self;

    function SprintView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(SprintView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

				$("#sprintList").html("");
				
                $(document).on("board", function (evt, data)
                {
                    $("#sprintList").html("");
					
                    self.presenter.getList(data.id);
                });
				
				$("#sprintList").change(function ()
                {
					$(document).trigger( "sprint", {id: $(this).val(), name: $(this).find('option:selected').text(), startDate: $(this).find('option:selected').data("startdate"), endDate: $(this).find('option:selected').data("enddate")});
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                $.each( data.values, function( key, value )
                {
                   $("#sprintList").append("<option data-startdate='" +value.startDate + "' data-enddate='" +value.endDate + 
											"' data-state='" + value.state + "' value='" + value.id + "'>" + value.name + "</option>")
                });

                var last = $("#sprintList option[data-state='active']");
				
				if(data.isLast)
                {
					if(last.length == 0)
					{
						last = $("#sprintList option:last");
					}
					
					last.attr("selected", "selected").change();
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

    views.SprintView = SprintView;
})(viewer.views);