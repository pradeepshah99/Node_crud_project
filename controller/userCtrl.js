var express = require('express');
var router = express.Router();
var database = require('../model/userSchema');


router.post('/create', async(req, res)=>
{
    const checkEmail = await database.findOne({email: req.body.email});
    if(checkEmail)
    {
        res.status(401).json({message : "No Such Email is found there"});
    }
    else
    {
        let data = database();
        data.fullname = req.body.fullname;
        data.email = req.body.email;
        data.password = req.body.password;
        data. mobile = req.body.mobile;
        data.city = req.body.city;
        data.state = req.body.state;
        data.country = req.body.country;

        if(!req.body.fullname || !req.body.email||!req.body.password|| !req.body.mobile ||!req.body.city ||!req.body.state ||!req.body.country)
        {
            res.status(401).json({message : "Please fill the all fields"});
        }
        else
        {
            data.save().then((err, result)=>
            {
                if(err)
                {
                    res.status(501).json({message: "Something Wrong"});
                }
                else{
                    res.status(200).json({message: "data added", data: result});
                }
            });
        }
    }
});

router.post('/login', async(req, res)=>
{
    const checkmail = await database.findOne({email : req.body.email});
})












module.exports = router;