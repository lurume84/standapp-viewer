var viewer = viewer || {};
viewer.helpers = viewer.helpers || {};
viewer.presenters = viewer.presenters || {};
viewer.views = viewer.views || {};
viewer.models = viewer.models || {};
viewer.interactors = viewer.interactors || {};
viewer.listeners = viewer.listeners || {};

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
                return new viewer.presenters.BoardPresenter(this);
            },
            enumerable: false
        },
        getSprintPresenter : {
            value: function()
            {
                return new viewer.presenters.SprintPresenter(this);
            },
            enumerable: false
        },getIssuePresenter : {
            value: function()
            {
                return new viewer.presenters.IssuePresenter(this);
            },
            enumerable: false
        },
        getBoardView : {
            value: function(presenter)
            {
                return new viewer.views.BoardView(presenter);
            },
            enumerable: false
        },
        getSprintView : {
            value: function(presenter)
            {
                return new viewer.views.SprintView(presenter);
            },
            enumerable: false
        },getUserStoryView : {
            value: function(presenter)
            {
                return new viewer.views.UserStoryView(presenter);
            },
            enumerable: false
        },
        getTaskView : {
            value: function(presenter)
            {
                return new viewer.views.TaskView(presenter);
            },
            enumerable: false
        },
        getWorkView : {
            value: function(presenter)
            {
                return new viewer.views.WorkView(presenter);
            },
            enumerable: false
        },
		getMasterView : {
            value: function(presenter)
            {
                return new viewer.views.MasterView(presenter);
            },
            enumerable: false
        },
        getBoardInteractor : {
            value: function()
            {
                return new viewer.interactors.BoardInteractor();
            },
            enumerable: false
        },
        getSprintInteractor : {
            value: function()
            {
                return new viewer.interactors.SprintInteractor();
            },
            enumerable: false
        },
        getIssueInteractor : {
            value: function()
            {
                return new viewer.interactors.IssueInteractor();
            },
            enumerable: false
        },
        getLoginPresenter : {
            value: function()
            {
                return new viewer.presenters.LoginPresenter(this);
            },
            enumerable: false
        },
        getLoginView : {
            value: function(presenter)
            {
                return new viewer.views.LoginView(presenter);
            },
            enumerable: false
        },
        getLoginInteractor : {
            value: function()
            {
                return new viewer.interactors.LoginInteractor();
            },
            enumerable: false
        },
        getVideoChatPresenter : {
            value: function()
            {
                return new viewer.presenters.VideoChatPresenter(this);
            },
            enumerable: false
        },
        getVideoChatView : {
            value: function(presenter)
            {
                return new viewer.views.VideoChatView(presenter);
            },
            enumerable: false
        },
        getVideoChatInteractor : {
            value: function()
            {
                return new viewer.interactors.VideoChatInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(viewer.helpers);

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
})(viewer.helpers);