// Grand Festival song time slot, requires hour and three songs names for the Squid Sisters, Off the Hook, and Deep Cut
class TimeSlot {
    constructor(hour = 0, sisters = "Marie", hook = "Pearl", cut = "Shiver") {
        this.hour = hour;
        this.squid_sisters = sisters;
        this.off_the_hook = hook;
        this.deep_cut = cut;
    }
}

// Displays song names
const displayTimeSlot = (slot) => {
  console.log(slot.squid_sisters);
  if(slot.squid_sisters == "Three Wishes" || slot.squid_sisters == "Maritime Memory") {
    widget[0].classList.toggle("day-switch")
    threeWishes[0].classList.toggle("day-switch");
  }

  for(i = 0; i < 2; i++){
    sisters[i].textContent = slot.squid_sisters;
    hook[i].textContent = slot.off_the_hook;
    cut[i].textContent = slot.deep_cut;
  }
  
}

// Returns stack of TimeSlot objects, loops through contentList derived from CSVprocessing
const createTimeSlotStack = (contentList) => {

    let timeslots = new Array();

    while (contentList.length != 0){
      let slot = new TimeSlot();

      slot.deep_cut = contentList.pop().trim();
      slot.off_the_hook = contentList.pop().trim();
      slot.squid_sisters = contentList.pop().trim();
      slot.hour = contentList.pop().trim();
      // console.log(slot);

      timeslots.push(slot);
    }

    return timeslots;
}

// Returns array of values from a comma-separated-value file
const CSVprocessing = (content) => {
  content = content.replace("\r\n", ",");
  contentList = content.split(",");
  return contentList;
}

const mainLoop = async(fileInput) => {

  let timeslots;

  timeslots = createTimeSlotStack(CSVprocessing(fileInput));

  let slotCheck = setInterval(() => {

    if (nextNeeded == true && timeslots.length > 0) {

      slot = timeslots.pop();
      displayTimeSlot(slot);
      nextNeeded = false;
      // console.log(slot.hour)

      // Set the date we're counting down to
      let countDownDate = new Date(slot.hour).getTime();

      // Setting up coundown
      let timer = setInterval(function() {

        // Get today's date and time
        let now = new Date().getTime();
      
        // Find the distance between now and the count down date
        let distance = countDownDate - now;
      
        // Time calculations for days, hours, minutes and seconds
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
        // Display the result in the element with id="demo"
        document.getElementById("timer").innerHTML = hours + "h "
        + minutes + "m " + seconds + "s ";
      
        // If the count down is finished, write some text
        if (distance < 0) {
          document.getElementById("timer").innerHTML = "NEXT!"
          nextNeeded = true;
          clearInterval(timer);
        }
      }, 1000);
    }

    // Executes when timer is over and there's no more time slots
    if (nextNeeded == true && timeslots.length == 0){
      clearInterval(timer);
      clearInterval(slotCheck);
      document.getElementById('song-names-before').style.display = "none"; // Hides song names
      document.getElementById('song-names-after').style.display = "none"; // Hides song names
      document.getElementById("timer").innerHTML = "THAT'S A WRAP!"; // Changes timer to a text string
    }
    
  }, 1000)
}

let content;
let nextNeeded = true;
let sisters = document.getElementsByClassName('squid-sisters');
let hook = document.getElementsByClassName('off-the-hook');
let cut = document.getElementsByClassName('deep-cut');
let fade = document.getElementsByClassName('fade');
let widget = document.getElementsByClassName("widget");
let threeWishes = document.getElementsByClassName("three-wishes-widget");
let reader = new FileReader();

// Retrieves file from <input> then hides it
fileInput = document.getElementById('file-selector');

fileInput.onchange = async () => {
  const selectedFile = await fileInput.files[0];
  reader.readAsText(selectedFile);

  reader.onload = () => {
    fileInput.style.display = "none";
    mainLoop(reader.result);
  }

  reader.onerror = () => {
    console.log("Error opening file.");
  }
}

