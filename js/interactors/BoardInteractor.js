(function(interactors)
{
    function BoardInteractor()
    {
        
    }

    Object.defineProperties(BoardInteractor.prototype,
    {
        getList : {
            value: function(startAt, listener)
            {
				$.ajax
				({
					type: "GET",
					url: credentials.domain + "/rest/agile/1.0/board?maxResults=1000&startAt=" + startAt,
					dataType: 'json',
					beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", credentials.token); 
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(error);
					}
				});
            },
            enumerable: false
        }
        
    });

    interactors.BoardInteractor = BoardInteractor;
})(standapp.interactors);