(function(interactors)
{
    function BurndownInteractor()
    {
        
    }

    Object.defineProperties(BurndownInteractor.prototype,
    {
        getIssue : {
            value: function(key, listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/issue/" + key + "?fields=subtasks&expand=changelog",
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
        },
        getIssues : {
            value: function(issues, listener, startAt = 0)
            {
                var self = this;
                
                var pagination = 1000;
                
                $.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/search/?jql=parent in (" + issues.toString() + ")+order+by+updated&fields=assignee,status,parent,summary,issuetype,timetracking&maxResults=" + pagination + "&startAt=" + startAt+"&expand=changelog",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
                        listener.onSuccess(json);
                        
                        if(json.startAt + pagination <= json.total)
                        {
                            self.getIssues(issues, listener, json.startAt + pagination);
                        }
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
        },
		getAssignableUsers : {
            value: function(issue, listener)
            {
                var self = this;
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "rest/api/2/user/assignable/search?issueKey=" + issue,
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
        },
		getUserGroups : {
            value: function(userid, listener)
            {
                var self = this;
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/3/user/groups?accountId=" + userid,
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
        },
		load : {
            value: function(board, sprint, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "/data/burndown_" + board + "_" + sprint + ".json",
					dataType: 'json',
                    contentType: 'application/json',
                    beforeSend: function(xhr)
                    {
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
                        if(jqxhr.status == 404)
                        {
                            listener.onSuccess({});
                        }
                        else
                        {
                            listener.onError(jqxhr);
                        }
					}
				});
            },
            enumerable: false
        },
        save : {
            value: function(board, sprint, data, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "/data/burndown_" + board + "_" + sprint + ".json",
					data: JSON.stringify(data),
					dataType: 'json',
                    contentType: 'application/json',
                    beforeSend: function(xhr)
                    {
                        
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

    interactors.BurndownInteractor = BurndownInteractor;
})(viewer.interactors);