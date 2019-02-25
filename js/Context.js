var alba = alba || {};
alba.helpers = alba.helpers || {};
alba.presenters = alba.presenters || {};
alba.views = alba.views || {};
alba.models = alba.models || {};
alba.interactors = alba.interactors || {};
alba.listeners = alba.listeners || {};

(function(helpers)
{
    function Context()
    {
        
    }

    Object.defineProperties(Context.prototype,
    {
        getBoardPresenter : {
            value: function()
            {
                return new alba.presenters.BoardPresenter(this);
            },
            enumerable: false
        },
        getSprintPresenter : {
            value: function()
            {
                return new alba.presenters.SprintPresenter(this);
            },
            enumerable: false
        },getIssuePresenter : {
            value: function()
            {
                return new alba.presenters.IssuePresenter(this);
            },
            enumerable: false
        },
        getBoardView : {
            value: function(presenter)
            {
                return new alba.views.BoardView(presenter);
            },
            enumerable: false
        },
        getSprintView : {
            value: function(presenter)
            {
                return new alba.views.SprintView(presenter);
            },
            enumerable: false
        },getUserStoryView : {
            value: function(presenter)
            {
                return new alba.views.UserStoryView(presenter);
            },
            enumerable: false
        },
        getTaskView : {
            value: function(presenter)
            {
                return new alba.views.TaskView(presenter);
            },
            enumerable: false
        },
        getWorkView : {
            value: function(presenter)
            {
                return new alba.views.WorkView(presenter);
            },
            enumerable: false
        },
		getMasterView : {
            value: function(presenter)
            {
                return new alba.views.MasterView(presenter);
            },
            enumerable: false
        },
        getBoardInteractor : {
            value: function()
            {
                return new alba.interactors.BoardInteractor();
            },
            enumerable: false
        },
        getSprintInteractor : {
            value: function()
            {
                return new alba.interactors.SprintInteractor();
            },
            enumerable: false
        },
        getIssueInteractor : {
            value: function()
            {
                return new alba.interactors.IssueInteractor();
            },
            enumerable: false
        },
		getLabInteractor : {
            value: function()
            {
                return new alba.interactors.LabInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(alba.helpers);

(function(helpers)
{
    var list =  {
                    board : "getBoardPresenter",
                    sprint : "getSprintPresenter",
                    issue : "getIssuePresenter"
                };

    function Initializer()
    {
        var initList = initializeConfig || {};

        var context = new helpers.Context();
        for(var k in initList)
        {
            if(list.hasOwnProperty(initList[k]))
            {
                context[list[initList[k]]]();
            }
        }
    }

    helpers.Initializer = Initializer;
})(alba.helpers);