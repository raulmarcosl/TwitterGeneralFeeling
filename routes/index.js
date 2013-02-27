
/*
 * GET home page.
 */

exports.showTweets = function(req, res){

    // DEBUG: variable temporal solo para trastear con la vista 
    tweets = [
        {
            "favorited": false,
            "created_at": "Mon Jun 27 19:32:19 +0000 2011",
            "text": "Misleading error message - If you try to follow a user who was recently suspended, you may see an error... http://t.co/cCIWIwg",
        }
        ,{
            "favorited": false,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "Tweet delivery delays for streaming clients - We experienced temporary delays but the issue has now been... http://t.co/IcQut5R",
        }
        ,{
            "favorited": false,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "This is just a test",
        }
    ]
    // ---

    res.render('index', { tweets: tweets, title: "Twitter General Feeling Analizer", percentage: 55 });
};

