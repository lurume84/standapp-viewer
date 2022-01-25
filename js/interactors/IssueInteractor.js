(function(interactors)
{
    function IssueInteractor()
    {
        
    }

    Object.defineProperties(IssueInteractor.prototype,
    {
        getList : {
            value: function(boardId, sprintId, listener)
            {
				$.ajax
				({
					type: "GET",
					url: credentials.server + "/rest/agile/1.0/board/" + boardId + "/sprint/" + sprintId + "/issue?maxResults=1000",
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

    interactors.IssueInteractor = IssueInteractor;
})(viewer.interactors);