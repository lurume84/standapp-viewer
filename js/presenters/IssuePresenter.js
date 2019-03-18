(function(presenters)
{
    function IssuePresenter(Context)
    {
        this.interactor = Context.getIssueInteractor();
       
        this.userStoryView = Context.getUserStoryView(this);
        this.taskView = Context.getTaskView(this);
        this.workView = Context.getWorkView(this);
		this.masterView = Context.getMasterView(this);
    }

    Object.defineProperties(IssuePresenter.prototype,
    {
        getList : {
            value: function(boardId, sprintId)
            {
                var self = this;
                    
                this.interactor.getList(boardId, sprintId, new standapp.listeners.BaseDecisionListener(
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
})(standapp.presenters);