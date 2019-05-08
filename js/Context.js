var standapp = standapp || {};
standapp.helpers = standapp.helpers || {};
standapp.presenters = standapp.presenters || {};
standapp.views = standapp.views || {};
standapp.models = standapp.models || {};
standapp.interactors = standapp.interactors || {};
standapp.listeners = standapp.listeners || {};

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
                return new standapp.presenters.BoardPresenter(this);
            },
            enumerable: false
        },
        getSprintPresenter : {
            value: function()
            {
                return new standapp.presenters.SprintPresenter(this);
            },
            enumerable: false
        },getIssuePresenter : {
            value: function()
            {
                return new standapp.presenters.IssuePresenter(this);
            },
            enumerable: false
        },
        getBoardView : {
            value: function(presenter)
            {
                return new standapp.views.BoardView(presenter);
            },
            enumerable: false
        },
        getSprintView : {
            value: function(presenter)
            {
                return new standapp.views.SprintView(presenter);
            },
            enumerable: false
        },getUserStoryView : {
            value: function(presenter)
            {
                return new standapp.views.UserStoryView(presenter);
            },
            enumerable: false
        },
        getTaskView : {
            value: function(presenter)
            {
                return new standapp.views.TaskView(presenter);
            },
            enumerable: false
        },
        getWorkView : {
            value: function(presenter)
            {
                return new standapp.views.WorkView(presenter);
            },
            enumerable: false
        },
		getMasterView : {
            value: function(presenter)
            {
                return new standapp.views.MasterView(presenter);
            },
            enumerable: false
        },
        getBoardInteractor : {
            value: function()
            {
                return new standapp.interactors.BoardInteractor();
            },
            enumerable: false
        },
        getSprintInteractor : {
            value: function()
            {
                return new standapp.interactors.SprintInteractor();
            },
            enumerable: false
        },
        getIssueInteractor : {
            value: function()
            {
                return new standapp.interactors.IssueInteractor();
            },
            enumerable: false
        },
        getLoginPresenter : {
            value: function()
            {
                return new standapp.presenters.LoginPresenter(this);
            },
            enumerable: false
        },
        getLoginView : {
            value: function(presenter)
            {
                return new standapp.views.LoginView(presenter);
            },
            enumerable: false
        },
        getLoginInteractor : {
            value: function()
            {
                return new standapp.interactors.LoginInteractor();
            },
            enumerable: false
        },
        getVideoChatPresenter : {
            value: function()
            {
                return new standapp.presenters.VideoChatPresenter(this);
            },
            enumerable: false
        },
        getVideoChatView : {
            value: function(presenter)
            {
                return new standapp.views.VideoChatView(presenter);
            },
            enumerable: false
        },
        getVideoChatInteractor : {
            value: function()
            {
                return new standapp.interactors.VideoChatInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(standapp.helpers);

(function(helpers)
{
    var list =  {
                    login : "getLoginPresenter"
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
})(standapp.helpers);