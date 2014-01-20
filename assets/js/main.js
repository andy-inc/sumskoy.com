/**
 * Created by Andy <andy@sumskoy.com> on 17/01/14.
 */
(function($, Davis, window){

    var pages = {
        index: function(){
            $.get("/pages/home.html", function( data ) {
                $('#content').html(data);
            });
        },
        info: function(page){
            $.get("/pages/"+page+".html", function( data ) {
                $('#content').html(data);
            });
        }
    };

    $(function(){

        var app = Davis(function () {
            this.get('/:id', function (req) {
                pages.info(req.params['id']);
            });
            this.get('/', pages.index);
            this.get('/posts/:id', function (req) {
                pages.info('posts/' + req.params['id']);
            });
        });

        app.configure(function (config) {
            config.generateRequestOnPageLoad = true;
        });

        app.start();

        var _onResize = function(){
            $('.wrap-content').width($('body').width() - $('.side').width() - 100);
        };
        _onResize();

        $(window).resize(_onResize);

    });

})(jQuery, Davis, window);