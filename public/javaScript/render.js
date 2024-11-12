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

socket.emit("give-all-events")
let events = []
socket.on("take-events" , async (data , communityData)=>{
    console.log(data)
    await data.forEach(element=>{
      element.communityName = communityData.communityName
      element.communityProfile = communityData.communityProfile
      console.log(element)
      events.push(element)
    })
})

socket.on("take-all-events" , ()=>{
  console.log(events)
    events.forEach(async (element)=>{
      let communitydata = {

      };
        let eventContainer = document.getElementById("eventContainer")
        let eventCard = document.createElement("div")
        eventCard.className = " rounded-lg shadow-lg p-4 border-t-4  "
        eventCard.style = "background : #f1f1f1; display:flex ; flex-direction: column;"
        eventCard.addEventListener("click" , ()=>{openThisEvent(element._id , element.communityId)})
        eventCard.innerHTML = 
        ` 
          <img
            src="uploads/CommunityProfiles/${element.eventBanner}"
            alt="Event Image"
            class="w-full h-40 object-cover rounded-lg"
          />

          <h3 class="text-lg font-semibold mt-4">${element.eventName}</h3>
          <p class="text-gray-600 text-sm mt-2">
          ${element.eventDescription}
          </p>

          <div style="margin : auto 0 0 0" class="flex justify-between items-center mt-4">
            <span class="text-sm text-gray-500">27 Sep 2024</span>
            <span
              class="bg-gray-200 text-sm text-red-500 px-3 py-1 rounded-full"
              >&bull; live</span
            >
          </div>

          <!-- Flex container for circular logo and button in the same line -->
          <div  class="flex items-center ">
            <!-- Circle div for logo -->
            <div
              class="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center"
            >
              <!-- Placeholder for community logo -->
              <img
                src="uploads/CommunityProfiles/${element.communityProfile}"
                alt="Community Logo"
                class="w-10 h-10 rounded-full"
              />
            </div>
            <!-- Button for Community Name -->
            <button
              class="bg-transparent text-black font-semibold py-2 px-1 rounded-lg text-lg"
            >
              ${element.communityName}
            </button>
          </div>`

        eventContainer.append(eventCard)
    })
})


function openThisEvent( eventId , communityId){
  window.open(`/renderThisEvent?_id=${eventId}&communityId=${communityId}`, "_self");
}



// socket.on("give-communites" , (data)=>{
    
// })

