(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();

        this.boardView = Context.getBoardPresenter().boardView;
        this.sprintView = Context.getSprintPresenter().sprintView;
        
        this.userStoryView = Context.getIssuePresenter().userStoryView;
        this.taskView = Context.getIssuePresenter().taskView;
        this.workView = Context.getIssuePresenter().workView;
		this.masterView = Context.getIssuePresenter().masterView;
    }

    Object.defineProperties(LoginPresenter.prototype,
    {
		login : {
            value: function(server, user, password)
            {
                var self = this;
                    
                this.interactor.login(server, user, password, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.checkToken();
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        },
		checkToken : {
            value: function()
            {
                var self = this;
                
                this.interactor.getToken(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        credentials = data;
						
                        self.healthCheck(data,  function()
												{
													self.loginView.load();
													self.boardView.init();
													self.sprintView.init();
													
													self.masterView.init();
													self.workView.init();
													self.userStoryView.init();
													self.taskView.init();
												});
                    },
                    function(data)
                    {
                        
                    }));
            },
            enumerable: false
        },
        healthCheck : {
            value: function(data, callback)
            {
                var self = this;
                    
                this.interactor.healthCheck(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        callback(data);
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.LoginPresenter = LoginPresenter;
})(viewer.presenters);