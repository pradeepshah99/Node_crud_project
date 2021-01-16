var express = require('express');
var router = express.Router();
var database = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth')



router.post('/create', async(req, res)=>
{
    const checkEmail = await database.findOne({email: req.body.email});
    if(checkEmail)
    {
        res.status(401).json({message : "Account Already Exist"});
    }
    else
    {
        let data = database();
        const regex = 
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
            data.save().then((err, result) => {
                if(err) {
                    res.json(err);
                } else {
                    res.status(200).json({message: "Data saved successfully", Result : result});
                }
            });
        }
    }
});

router.post("/login", async (req, res) => { 
   
    const { email, password } = req.body;
        try {
          let user = await database.findOne({
            email
          });
          if (!user)
            return res.status(400).json({
              message: "User Not Exist"
            });
    
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return res.status(400).json({
              message: "Incorrect Password !"
            });
    
          const payload = {
            user: {
              id: user.id
            }
          };
    
           const token = jwt.sign(
            payload,
            "deep",
            {
              expiresIn: "1h"
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({Generated_Token:
                token
              });
            }
          );
        } catch (e) {
          console.error(e);
          res.status(500).json({
            message: "Server Error"
          });
        }
      }
    );

      router.get('/profile', auth, async(req,res)=>
      {
        try {
            // request.user is getting fetched from Middleware after token authentication
            const user = await database.findById(req.user.id);
            res.json({message:`User has been fetched of id ${req.user.id}`, data: user});
          } catch (e) {
            res.send({ message: "Error in Fetching user" });
          }
      });

      router.put('/update', auth, async (req, res)=>
      {
          let salt = 10;
          let hasedPassword = bcrypt.hashSync(req.body.password, salt);

          await database.findByIdAndUpdate(req.user.id, {fullname:req.body.fullname, password:hasedPassword, mobile:req.body.mobile, city:req.body.city, state: req.body.state, country: req.body.country}, {new:true}).then(user=>
            {
                if(!user)
                {
                    return res.status(404).send({message : "User not found with this ID" + req.user.id})
                }
                res.json(user);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with this ID " + req.user.id
                    });                
                }
                return res.status(500).send({
                    message: "Error updating user with id " + req.user.id
                });
            })
      });


      router.delete('/delete', auth, async(req, res)=>
      {
          await database.findByIdAndDelete(req.user.id).then((err, user)=>
          {
              if(err) throw err;
              else{
                  res.status(200).json({message : "User with" + req.user.id + "has been deleted", data: user}), {Deleted_user : user};
              }
          }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.user.id
                });                
            }
            else{
                return res.status(500).send({
                    message: "Error updating note with id " + req.user.id
                });
            }
            
        });
      })










module.exports = router;
