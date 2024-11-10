let profileScroll = document.getElementById("profile-scroll")

socket.emit("give-communites")
socket.on("render-communites" , (communities)=>{
    console.log(communities)

    communities.forEach(element => {

        let communitesBlock = document.createElement("a")
        communitesBlock.href = "/community?_id="+element._id
        communitesBlock.innerHTML = `
            <div class="flex-shrink-0 text-center">
            <img
          src="uploads/CommunityProfiles/${element.communityProfile}"
          alt="Profile 1"
          class="w-14 h-14 rounded-full border-4 "
          style="border: 4px solid rgb(126 175 144);"
        />
        </div>
        <p class="text-xs mt-1">${element.communityName}</p>
        `

        profileScroll.append(communitesBlock)

        
    });
})



// socket.on("give-communites" , (data)=>{
    
// })

