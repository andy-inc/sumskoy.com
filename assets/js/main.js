/**
 * Created by Andy <andy@sumskoy.com> on 17/01/14.
 */
(function($, Davis, window, markdown, moment){
    var POSTS_ON_PAGE = 5;

    var posts = [];
    var jq = {
        posts: $('<div></div>')
    };
    var indexPageCache = null;
    var currentPage = null;



    var getPostHeader = function(post){
        var d = moment(post.date);
        return $('<div class="post"></div>')
            .append($('<h5 class="date"></h5> ').text(d.format('LLLL')))
            .append($('<h4></h4>').append($('<a href="/posts/'+post.name+'"></a>').text(post.title)))
            .append($('<p data-type="post-preview" data-name="'+post.name+'"></p>'));
    };

    var addPost = function(post){
        var $post = getPostHeader(post);
        $.get('/posts/' + post.name + '.preview.md', function(data){
            var preview = $('p[data-type="post-preview"][data-name="'+post.name+'"]');
            if (preview.length == 0){
                preview = $('p', $post);
            }
            preview.html(markdown.toHTML(data));
        });
        jq.posts.append($post);
    };

    var buildPostList = function(page){
        jq.posts.empty();
        for(var i = (page-1) * POSTS_ON_PAGE; i < page*POSTS_ON_PAGE; i++){
            if (posts[i] == null) break;
            addPost(posts[i]);
        }
    };



    var showPost = function(postName){
        var post = null;
        for(var i = 0; i < posts.length; i++){
            if (posts[i].name === postName){
                post = posts[i];
                break;
            }
        }
        var $content = $('#content');
        $content.empty();
        if (post === null){
            $content.append('<div>Post not found... sorry</div>');
            return;
        }
        var $post = getPostHeader(post);
        $.get('/posts/' + post.name + '.md', function(data){
            $post.append($('<p></p>').html(markdown.toHTML(data)));
        });
        $content.append($post);
    };

    var updatePagesInHome = function(page){
        var totalPages = Math.ceil(posts.length / POSTS_ON_PAGE);
        var $pages = $('.pages', indexPageCache);
        $pages.empty();
        var prev = page - 1,
            next = page + 1;
        if (prev < 1) prev = 1;
        if (next > totalPages) next = totalPages;
        $pages.append($('<div class="page"><a href="/?page=' + prev + '" class="' + (page == prev ? "active" : "") + '"> &#8592; Back</a></div>'));

        for(var i = page - 3; i < page + 3; i++){
            if (i < 1) continue;
            if (i > totalPages) break;
            $pages.append($('<div class="page"><a href="/?page=' + i + '" class="' + (page == i ? "active" : "") + '"> ' + i + '</a></div>'));
        }

        $pages.append($('<div class="page"><a href="/?page=' + next + '" class="' + (page == next ? "active" : "") + '"> Next &#8594;</a></div>'));
    };

    var getURLParameter = function(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
        );
    };


    var pages = {
        index: function(){
            currentPage = 'index';
            var page = getURLParameter('page');
            if (isNaN(page)) page = '1';
            page = parseInt(page, 10);
            buildPostList(page);
            if (indexPageCache == null){
                $.get("/pages/home.html", function( data ) {
                    indexPageCache = $(data);
                    $('.posts', indexPageCache).html(jq.posts.html());
                    $('#content').empty().append(indexPageCache);
                    updatePagesInHome(page);
                });
            } else {
                $('.posts', indexPageCache).html(jq.posts.html());
                $('#content').empty().append(indexPageCache);
                updatePagesInHome(page);
            }
            $('body').scrollTop(0);
        },
        info: function(page){
            currentPage = page;
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
                showPost(req.params['id']);
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

    $.getJSON('/posts/info.json').success(function(data){
        posts = data.map(function(el){
            el.date = new Date(el.date);
            return el;
        }).sort(function(a,b){
                if (a.date > b.date) return -1;
                else if (a.date < b.date) return 1;
                else return 0;
            });
        if (currentPage === 'index'){
            pages.index();
        }
    });

})(jQuery, Davis, window, markdown, moment);