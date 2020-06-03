(function(presenters)
{
    function VideoChatPresenter(Context)
    {
        this.interactor = Context.getVideoChatInteractor();
       
        this.videoChatView = Context.getVideoChatView(this);
    }

    Object.defineProperties(VideoChatPresenter.prototype,
    {
        connect : {
            value: function(user, password, server)
            {
                var self = this;
                
                
            },
            enumerable: false
        }
    });

    presenters.VideoChatPresenter = VideoChatPresenter;
})(viewer.presenters);