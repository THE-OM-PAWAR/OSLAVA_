let profileScroll = document.getElementById("profile-scroll")

socket.emit("give-communites")
socket.on("render-communites" , (communities)=>{
    console.log(communities)

    communities.forEach(element => {

        let communitesBlock = document.createElement("div")
        communitesBlock.className="flex-shrink-0 text-center"
    
        communitesBlock.innerHTML = `
            <img
          src="uploads/CommunityProfiles/${element.communityProfile}"
          alt="Profile 1"
          class="w-14 h-14 rounded-full border-4 border-green-500"
        />
        <p class="text-xs mt-1">${element.communityName}</p>
        `

        profileScroll.append(communitesBlock)

        
    });
})



// socket.on("give-communites" , (data)=>{
    
// })

