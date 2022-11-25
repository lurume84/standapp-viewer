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
					url: credentials.server + "/rest/agile/1.0/board?maxResults=1000&startAt=" + startAt,
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
        },
		getIssueStatus : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/status",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        }
        
    });

    interactors.BoardInteractor = BoardInteractor;
})(viewer.interactors);