(function(presenters)
{
    function BoardPresenter(Context)
    {
        this.interactor = Context.getBoardInteractor();
		this.interactorSettings = Context.getSettingsInteractor();
		
        this.view = Context.getBoardView(this);
		this.view.init();
    }

    Object.defineProperties(BoardPresenter.prototype,
    {
        getList : {
            value: function(startAt = 0)
            {
                var self = this;
                    
                this.interactor.getList(startAt, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.load(data);
						
						if(!data.isLast)
                        {
                            self.getList(startAt + data.values.length);
                        }
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
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
        setSetting : {
            value: function(setting, value)
            {
                var self = this;
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        data[setting] = value;
                        
                        self.interactorSettings.save(data, new viewer.listeners.BaseDecisionListener(
                        function()
                        {
                            self.view.onSaveSetting(data);
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
            },
            enumerable: false
        }
    });

    presenters.BoardPresenter = BoardPresenter;
})(viewer.presenters);