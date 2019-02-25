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

                $(document).ready(function ()
                {
					$("#boardList").html("");
					
                    self.presenter.getList();

                    $('#content').kinetic({cursor: "auto"});
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                $.each( data.values, function( key, value )
                {
                    $("#boardList").append("<option value='" + value.id + "'>" + value.name + "</option>")
                });

                if(data.isLast)
                {
                    $("#boardList").change();
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
})(alba.views);