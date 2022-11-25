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
            value: function(board, sprintId)
            {
                var self = this;
                    
                this.interactor.getList(board.id, sprintId, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.userStoryView.load(board, data);
                        self.taskView.load(board, data);
                        self.workView.load(board, data);
                        self.masterView.load(board);
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
})(viewer.presenters);