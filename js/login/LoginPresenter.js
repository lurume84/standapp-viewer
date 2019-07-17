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
        
		//this.videoChatView = Context.getVideoChatPresenter().videoChatView;
    }

    Object.defineProperties(LoginPresenter.prototype,
    {
        login : {
            value: function(user, password, server)
            {
                var self = this;
                
                credentials.domain = $("#login .server").val();
                credentials.token = "Basic " + btoa(user + ":" + password);
                
                self.loginView.load();
                
                self.userStoryView.init();
                self.boardView.init();
                self.sprintView.init();
                
                self.masterView.init();
                self.workView.init();
                self.taskView.init();
                
                //self.videoChatView.init();
                
                // this.interactor.login(user, password, new standapp.listeners.BaseDecisionListener(
                    // function(data)
                    // {
                        // //credentials.token = data.authtoken.authtoken;

                        // self.loginView.load(data);
                        // self.boardView.init(data);
                        // self.sprintView.init(data);
                    // },
                    // function(data)
                    // {
                        // self.loginView.showError(data);
                    // }));
            },
            enumerable: false
        },
        checkToken : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getToken(new standapp.listeners.BaseDecisionListener(
                    function(data)
                    {
                        credentials.token = data.token;
                        credentials.domain = "http://" + data.host + ":" + data.port;

                        self.loginView.load();
                        self.boardView.init();
                        self.sprintView.init();
                        
                        self.masterView.init();
                        self.workView.init();
                        self.userStoryView.init();
                        self.taskView.init();
                        
                        self.videoChatView.init();
                    },
                    function(data)
                    {
                        
                    }));
            },
            enumerable: false
        }
    });

    presenters.LoginPresenter = LoginPresenter;
})(standapp.presenters);