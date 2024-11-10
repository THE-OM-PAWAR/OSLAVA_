const menu_option = document.getElementById("menuOptionsbox");

// getting the menu from here
socket.on("take-menu", (menu) => {
  let arr_menu = menu;

  // ,creating menu options using for each loop
  arr_menu.forEach((element) => {
    let menu_options = document.createElement("div");
    menu_options.className = "menuOption";
    menu_options.innerHTML = `${element.name}`;
    menu_option.appendChild(menu_options);
    menu_options.setAttribute("id", `${element.herf}`);
    menu_options.setAttribute("onclick", `btn_func(this)`);

    let box = document.getElementById("menuBtnC");
  });
});

// function for all menu option onclick
let btn_func = async (element) => {
  if (element.id === "logIn") {
    window.open(`/${element.id}`, "_self");
  } else if (element.id === "signUp") {
    window.open(`/${element.id}`, "_self");
  } else if (element.id === "consoles/userProfile.html") {
    window.open(`/${element.id}`, "_self");
  } else if (element.id === "consoles/joinedEvent.html") {
    window.open(`/${element.id}`, "_self");
  } else if (element.id === "HTML/about.html") {
    window.open(`/${element.id}`, "_self");
  } else if (element.id === "HTML/draft_result.html") {
    window.open(`/${element.id}`, "_self");
  }else if (element.id === "#") {
    window.open(`/html/underdevelopment.html`, "_self");
  }else if (element.id === "Home") {
    window.open(`/`, "_self");
  } else if (element.id === "management_console") {
    window.open(`/management_console`, "_self");
  } else {
    console.log(element.id);
    // call server for require options
    const response = await fetch(`/${element.id}`);

    //   getting data of response
    let data = await response.json();
    console.log(data);
    const modal_html = data.body.modal_html;
    if (data.position === "modal6") {
      const modal_main = document.getElementById("modal_main");
      closeMenu()
      modal_main.innerHTML = modal_html;
      modal_js();
    }
  }
};

let open_location = () => {
  window.open(`https://goo.gl/maps/AjvAuMniq6sfae2eA`)
};

let move_to_location = (element) => {
  // document.getElementById("location_button").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  if (element.textContent.includes("Location")) {
    console.log(element.textContent + "loc");
    document.getElementById("location_button").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    document.getElementById("location_button").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  } else if (element.textContent.includes("Contact")) {
    console.log(element.textContent + "con");
    document.getElementById("mobile_no_pre").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    document.getElementById("mobile_no_pre").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
};


const mobile_no2 = document.getElementById("mobile_no2");
const help_line_no = document.getElementById("help_line_no");


function closeMenu() {
  document.getElementById("menuSection").style.width = 0
}
function openMenu() {
  document.getElementById("menuSection").style.width = "100vw"
}