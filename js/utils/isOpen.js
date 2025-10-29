const day = new Date();
const newHour = day.getHours();
const newMiutes = day.getMinutes();
const today = day.getDay();
let dayOpen;

switch (today) {
    case 4:
        dayOpen = true;
        break;
    case 5:
        dayOpen = true;
        break;
    case 6:
        dayOpen = true;
        break;
    default:
        dayOpen = false;
        break;
}

const isOpen = newHour >= 18 && newHour < 22 && dayOpen;
const isNearClose = isOpen && newHour == 22 && newMiutes >= 30;

export { isOpen, isNearClose };
