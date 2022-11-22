(function(presenters)
{
    function SprintPresenter(Context)
    {
        this.interactor = Context.getSprintInteractor();
        this.sprintView = Context.getSprintView(this);
    }

    Object.defineProperties(SprintPresenter.prototype,
    {
        getList : {
            value: function(boardId, startAt = 0)
            {
                var self = this;
                    
                this.interactor.getList(startAt, boardId, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.sprintView.load(data);
						
						if(!data.isLast)
                        {
                            self.getList(boardId, startAt + data.values.length);
                        }
                    },
                    function(data)
                    {
                        self.sprintView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.SprintPresenter = SprintPresenter;
})(viewer.presenters);