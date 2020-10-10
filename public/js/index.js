


/// Update bio/location/headline ///

$('.update-btn').on('click', (e) => {
    const location = $('#location').val()
    const headline = $('#headline').val()
    const bio = $('#bio').val()
    
    if (!location || !headline || !bio) {
        $('#error-update').show()
    } else {

    let updateUser = {
        id: e.target.id,
        location, 
        headline,
        bio 
    }

    $.ajax(`/users/${e.target.id}`, {
        method: 'PUT',
        data: updateUser
        })
        .then(() => {
            setTimeout(function(){
                window.location.reload();
         }, 1000);
        })
        .catch(err => console.log(err))
   }
    
})



// new post //

$('.post-form').on('submit', (e) => {
    e.preventDefault()
    const newHeadline = $('#headline-text').val()
    const newText = $('#post-text').val()
    const id = e.target.id
     
    const newPosts = {
    headline: newHeadline,
    text: newText,
    userId: id

    }

    if (!newHeadline || !newText) {
        $('#small-error-update').show()
    } else {

    $.ajax(`/users/${e.target.id}/posts`, {
        method: 'PUT',
        data: newPosts
        })
        .then(() => {
            setTimeout(function(){
                window.location.reload();
         }, 1000);
        })
        .catch(err => console.log(err))

    }

})

// delete post //

$('.wall-delete-btn').on('click', (e) => {
    const walDel = e.target
    const delData = { 
    postId: $(walDel).parents('.card').attr('id'),
    userId: e.target.id 
    }
     $.ajax(`/users/${delData.userId}/posts`, {
         method: 'DELETE',
         data: delData
         })
         .then(() => {
             setTimeout(function(){
                 window.location.reload();
          }, 1000);
         })
         .catch(err => console.log(err))
    
     
})

/// find friend ////

$('.form-friend-search').on('submit', (e) => {
    e.preventDefault()
    const sameName = $('#check-user').text()
    const serBtn = e.target
    const searchTerm = $(serBtn).children().children('input').val()

    if (searchTerm == sameName) {

        $(".friend-div").empty()
        const nouser = $('<p class="text-center" style="font-size: 12px; color: red; margin-bottom: 10px;">Cannot add yourself</p>')
        $(".friend-div").append(nouser)

    }   else if (!searchTerm) {

        $(".friend-div").empty()
        const nouser = $('<p class="text-center" style="font-size: 12px; color: red; margin-bottom: 10px;">Empty fields</p>')
        $(".friend-div").append(nouser)

    } else {
    
        $.ajax(`/users/search` , {
            method: 'GET',
            data: searchTerm,
            success: function(response) {

                if (!response) {

                    $(".friend-div").empty()
                    const nouser = $('<p class="text-center" style="font-size: 12px; color: red; margin-bottom: 10px;">No User Found</p>')
                    $(".friend-div").append(nouser)
        
                } else { 
                        const friendDiv = $(".friend-div")
                        friendDiv.empty()
                        const friendSearch = `<div class="card bg-light" style="">
                        <div class="row m-0">
                            <img src="${response.image}" class="card-img-friend">
                        <div class="card-body border-0">
                            <h5 class="card-title">${response.username}</h5>
                            <p class="card-text">${response.location}</p>
                        </div>
                        <div class="d-flex" style="position: relative">
                            <button type="submit" class="btn friend-add-btn align-self-end m-3" id="${response.userId}">Add friend</button>
                            <span class="error-friend" style="font-size: 10px; color: red; display: none; position: absolute; bottom: 0">Pending their apporval.</span> 
                            <span class="error-friend2" style="font-size: 10px; color: red; display: none; position: absolute; bottom: 0">Pending your apporval.</span> 
                            <span class="success-friend" style="font-size: 10px; color: green; display: none; position: absolute; bottom: 0">Requested friendship.</span>   
                        </div>     
                        </div>
                    </div>`
                    friendDiv.append(friendSearch)
                }
            },      
    
            error: function(error) {
                console.log(error)
            }

        })
    }
})

// add friend button //


$('.friend-div').on('click', '.friend-add-btn', (e) => {
    const idToAdd = e.target.id
    const userReq = $('.update-btn').attr('id')
    const newImage = $('#check-image').attr('src')
    const newLoc = $('#check-location').html()
    const newUser = $('#check-user').html()

    const pendData = {
        idToAdd,
        userReq,
        newImage,
        newLoc,
        newUser
    }

    $.ajax(`/users/pendingfriends`, {
        method: 'POST',
        data: pendData
        })
        .then((addUser) => {
            if (addUser == 'alreadysent') {
                console.log('in already send conditional')
                $(".success-friend").hide()
                $(".error-friend").show()
            } else if (addUser == 'useralready') {
                $(".success-friend").hide()
                $(".error-friend2").show()   
            } else {
                console.log('this would suceeed')
                // $(".success-friend").show()
            }
            
        })
        .catch(err => console.log(err))

})

// add pending friend // 


$('.friend-pending-btn').on('click',  (e) => {
    const idToFriend = e.target.id
    const idToAddFriend = $('.friend-div').attr('id')
    const DataToFriend = {
        idToAddFriend,
        idToFriend
    }
    $.ajax(`/users/friends`, {
        method: 'POST',
        data: DataToFriend
        })
        .then(() => {
            console.log('.then after add pending')
            
        })
        .catch(err => console.log(err))

})
