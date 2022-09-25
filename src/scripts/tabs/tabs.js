// Inspired by:  Sikriti Dakua
// https://codepen.io/dev_loop/pen/WNvBzZG
// https://dribbble.com/devloop01



const links = [...document.querySelectorAll("#tabswitch li")];
const menu = document.querySelector("#tabswitch");
const light = document.querySelector("#tabswitch .tubelight");

let activeItem;

links.forEach((item, index) => {
    item.addEventListener("click", () => clickItem(item, index));
})

activeItem = links[0];

function clickItem(item, index) {
    if (activeItem == item) {
        return;
    }

    if (activeItem) {
        activeItem.classList.remove("active");
    }

    activeItem = item;
    item.classList.add("active");
    offsetLight(item, light);
    setStyle(index);
}

function offsetLight(element, light) {
    const menuItem = element.getBoundingClientRect();
    const menuOffset = menu.getBoundingClientRect();
    let left = Math.floor(menuItem.left - menuOffset.left + (light.offsetWidth - menuItem.width) / 2);
    light.style.transform = `translate3d(${left}px, 0 , 0)`;
}

function setStyle(index) {
    const bpmn = document.getElementById("js-canvas");
    const resizer = document.getElementById("verticalResizer");
    const simbpmn = document.getElementById("js-simbpmncanvas");
    if (index === 0) {
        bpmn.style.display = "block";
        resizer.style.display = "none";
        simbpmn.style.display = "none";

        bpmn.style.height = "100%";
    }

    if (index === 1) {
        bpmn.style.display = "block";
        resizer.style.display = "block";
        simbpmn.style.display = "block";

        bpmn.style.height = "50%";
        simbpmn.style.height = "50%";
    }

    if (index === 2) {
        bpmn.style.display = "none";
        resizer.style.display = "none";
        simbpmn.style.display = "block";

        simbpmn.style.height = "100%";
    }
}