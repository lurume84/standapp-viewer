(function(presenters)
{
    function IssuePresenter(Context)
    {
        this.interactor = Context.getIssueInteractor();
		this.labInteractor = Context.getLabInteractor();
       
        this.userStoryView = Context.getUserStoryView(this);
        this.userStoryView.init();

        this.taskView = Context.getTaskView(this);
        this.taskView.init();

        this.workView = Context.getWorkView(this);
        this.workView.init();
		
		this.masterView = Context.getMasterView(this);
        this.masterView.init();
    }

    Object.defineProperties(IssuePresenter.prototype,
    {
        getList : {
            value: function(boardId, sprintId)
            {
                var self = this;
                    
                this.interactor.getList(boardId, sprintId, new alba.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.userStoryView.load(data);
                        self.taskView.load(data);
                        self.workView.load(boardId, data);
                        self.masterView.load(boardId);
                    },
                    function(data)
                    {
                        self.userStoryView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.IssuePresenter = IssuePresenter;
})(alba.presenters);