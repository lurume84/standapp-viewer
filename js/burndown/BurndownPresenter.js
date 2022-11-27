(function(presenters)
{
    function BurndownPresenter(Context)
    {
        this.interactor = Context.getBurndownInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
        this.interactorBoard = Context.getBoardInteractor();
       
        this.view = Context.getBurndownView(this);
        this.view.init();
    }

    Object.defineProperties(BurndownPresenter.prototype,
    {
        getSettings : {
            value: function()
            {
                var self = this;
                    
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadSettings(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getIssues : {
            value: function(issues)
            {
                var self = this;
                    
                this.interactor.getIssues(issues, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSubtasks(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getSprint : {
            value: function(id)
            {
                var self = this;
                    
                this.interactorBoard.getSprint(id, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSprint(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
		getAssignableUsers : {
            value: function(issue)
            {
                var self = this;
                    
                this.interactor.getAssignableUsers(issue, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onAssignableUsers(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
		getUserGroups : {
            value: function(user)
            {
                var self = this;
                    
                this.interactor.getUserGroups(user.accountId, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onUserGroups(user, data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
		load : {
            value: function(board, sprint)
            {
                var self = this;
                    
                this.interactor.load(board, sprint, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoad(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
		save : {
            value: function(board, sprint, values)
            {
				this.interactor.load(board, sprint, new viewer.listeners.BaseDecisionListener(
				function(data)
				{
					self.interactor.save(board, sprint, values, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSave(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
				},
				function(data)
				{
					self.view.showError(data);
				}));
				
                var self = this;
                    
                
            },
            enumerable: false
        }
    });

    presenters.BurndownPresenter = BurndownPresenter;
})(viewer.presenters);