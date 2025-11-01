const day = new Date();
const newHour = day.getHours();
const newMiutes = day.getMinutes();
const today = day.getDay();
let dayOpen;
let hourOpen = 18;
let hourClose = 22;

switch (today) {
    case 4:
        dayOpen = true;
        break;
    case 5:
        dayOpen = true;
        hourClose = 23;
        break;
    case 6:
        dayOpen = true;
        hourClose = 23;
        break;
    default:
        dayOpen = false;
        break;
}

const isOpen = newHour >= hourClose && newHour < hourClose && dayOpen;
const isNearClose = isOpen && newHour == 22 && newMiutes >= 30;

export { isOpen, isNearClose, hourOpen, hourClose };
