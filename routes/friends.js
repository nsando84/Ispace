const express = require('express')
const db = require("../models")
const router = express.Router()
const PendingFriend = db.pendingfriends
const Friends = db.friends
const Profile = db.profiles

router.post('/pendingfriends', (req,res) => {

    let { idToAdd, userReq } = req.body

    PendingFriend.findOne({ where: { newFriendId: userReq, userId: idToAdd } })
    .then((alreadyCheck) => {
        if (alreadyCheck != null)  {
            res.send('alreadysent')
        } else {
            PendingFriend.findOne({ where: { newFriendId: idToAdd , userId: userReq } })
            .then((alreadyAdd) => {
                if (alreadyAdd != null) {
                    res.send('useralready')
                } else {
                     PendingFriend.create({
                        newFriendId: userReq,
                        userId: idToAdd,
                    })
                    .then(() => {    
                        res.sendStatus(200)
                    })
                    .catch(err => res.send(false)) 
                    
                }
            })
            .catch(err => console.log(err))
        }
        
        
    })
    .catch(err => console.log(err))
   
      
})

router.post('/friends', (req, res) => {
    let { idOfMe, idToFriend } = req.body
    PendingFriend.destroy({
        where: {
            newFriendId: idToFriend, userId: idOfMe
        }
    }).then(() => {
        Profile.findOne({ where: { userId: idToFriend}, attributes: ['userId']})
        .then(() => {
                Friends.create({ 
                    friendlist: idToFriend, 
                    userId: idOfMe,
                }).then((user) => {
                    return user
                })
        })
        .catch(err => console.log(err))

        Profile.findOne({ where: { userId: idOfMe}, attributes: ['userId']})
        .then(() => { 
                Friends.create({ 
                    friendlist: idOfMe, 
                    userId: idToFriend,
                }).then((user) => {

                    return user
                })
        })
        .catch(err => console.log(err))

        res.send('added to friends')
    })
    .catch(err => console.log(err))

})


router.delete('/friends' , (req, res ) => {
    let { idOfUser, friendIdToDel } = req.body
    console.log(req.body)
    Friends.destroy({ where: { friendlist: idOfUser, userId: friendIdToDel}})
    .then()
    .catch(err => console.log(err))
    Friends.destroy({ where: { friendlist: friendIdToDel, userId: idOfUser}})
    .then()
    .catch(err => console.log(err))
    res.sendStatus(200)
})

module.exports = router