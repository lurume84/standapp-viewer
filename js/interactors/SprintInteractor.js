(function(interactors)
{
    function SprintInteractor()
    {
        
    }

    Object.defineProperties(SprintInteractor.prototype,
    {
        getList : {
            value: function(startAt, boardId, listener)
            {
				$.ajax
				({
					type: "GET",
					url: credentials.domain + "/rest/agile/1.0/board/" + boardId + "/sprint?maxResults=1000&startAt=" + startAt,
					dataType: 'json',
					beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token); 
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

    interactors.SprintInteractor = SprintInteractor;
})(standapp.interactors);