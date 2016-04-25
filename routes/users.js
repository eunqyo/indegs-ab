var express = require('express');
var router = express.Router();

router.get('/session',function(req, res, next) {
    if(req.session.userinfo == null){
        res.json({
            status:false,
            body:null
        })
    } else {
        res.json({
            status:true,
            body:req.session.userinfo
        })
    }
});

router.post('/session',function(req, res, next) {
    var session = req.body;
    req.session.userinfo = session;
    res.json({
        status:true,
        body:session
    })
});

router.post('/published',function(req, res, next) {
    var published = JSON.parse(req.body.published);
    req.session.userinfo.published = published;
    res.json({
        status:true,
        body:req.session.userinfo
    })
});

router.post('/participate',function(req, res, next) {
    var participated = JSON.parse(req.body.participated);
    req.session.userinfo.participated = participated;
    res.json({
        status:true,
        body:req.session.userinfo
    })
});
router.post('/pic',function(req, res, next) {
    var pic = req.body.pic;
    req.session.userinfo.pic = pic;
    res.json({
        status:true,
        body:req.session.userinfo
    })
});

router.post('/logout', function(req, res, next) {
    req.session.userinfo = null
    res.json({
        'status':true
    })
});

module.exports = router;
