(function(views)
{
    var self;

    function VideoChatView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(VideoChatView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                this.webrtc = new SimpleWebRTC({
                    localVideoEl: 'localVideo',
                    remoteVideosEl: 'remoteVideo',
                    autoRequestMedia: true,
                });
                
                this.webrtc.on('localStream', () => {
                  
                });
                
                this.webrtc.createRoom("standapp", (err, name) =>
                {
                    $(".log").html("Room created, waiting for peers...")
                    
                    self.webrtc.shareScreen(() =>
                    {
                        
                        
                    });
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("#videoChat .progress").hide();
                
                var userName = $("#videoChat .user").val();
                
                if(userName == "")
                {
                    userName = "Recovered session";
                }
                
                $(".avatar-dropdown > span").html(userName);
                $("#videoChat")[0].close();
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                $("#videoChat .progress").hide();
                $("#videoChat .submit").show();
                
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.VideoChatView = VideoChatView;
})(viewer.views);