// import isOpen from "./utils/isOpen.js";
import { formatNumber, formatCurrency } from "./utils/numbers.js";
const isOpen = true;

const body = document.body;
const main = document.querySelector("main");
const hour = document.querySelector("#hour");
const navigationButtons = document.querySelectorAll("#pages li");
const pages = document.querySelectorAll("main section");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cart");
const listItems = document.querySelector("#list-items-cart");
const buttonCart = document.querySelector("#button-cart");
const lengthCart = document.querySelector("#length-cart");
const nameClient = document.querySelector("#name-client");
const adressClient = document.querySelector("#adress-client");
const pagamentClient = document.querySelector("#pagament-client");
const totalValue = document.querySelector("#total-value");
const detailsTotal = document.querySelector("#details-total");
const addIngredients = document.querySelector("#add-ingredients");
const valueEnd = document.querySelector("#value-end");
const confirmAddCart = document.querySelector("#confirm-add-cart");
const totalValueButton = document.querySelector("#total-value-button");
const confirmFood = document.querySelector("#confirm-food");
const modal = document.querySelector("#modal");
const text = document.querySelector("#text");

const cart = [];
let food = {};
let ingredients;
let time;

const fullReset = () => {
    overlay.classList.add("hide");
    body.classList.remove("no-scroll");
    addIngredients.classList.add("hide");
    ingredients?.classList.add("hide");
    cartItems.classList.add("hide");
    food = {};
};

const showAddIngredients = (button) => {
    const category = button.getAttribute("data-category");
    const name = button.getAttribute("data-name");
    const price = button.parentElement.querySelector(".price").textContent;

    ingredients = category
        ? addIngredients.querySelector(`.${category}`)
        : null;

    food.name = name;
    food.price = price;

    if (ingredients) {
        overlay.classList.remove("hide");
        body.classList.add("no-scroll");
        addIngredients.classList.remove("hide");
        ingredients.classList.remove("hide");
    }

    addCart(ingredients, price);
};

const addCart = (ingredients, price) => {
    if (!ingredients) {
        cart.push(food);
        showModal("Item Adicionado!", "#00b400");
        lengthCart.textContent = cart.length;
        fullReset();
        return;
    }

    let actualPrice = formatNumber(price);

    const calulation = (checkBox) => {
        if (actualPrice < price) return;

        const addPrice = formatNumber(
            checkBox.previousElementSibling.textContent
        );

        const incrementValue = (value, increment) => {
            return value + increment;
        };

        const decrementValue = (value, decrement) => {
            return value - decrement;
        };

        if (checkBox.checked) {
            price = incrementValue(actualPrice, addPrice);
        } else {
            price = decrementValue(actualPrice, addPrice);
        }

        actualPrice = price;

        setValueEnd(price);
        food.price = valueEnd.textContent;
    };

    ingredients.querySelectorAll("input").forEach((checkBox) =>
        checkBox.addEventListener("change", function () {
            calulation(this);
        })
    );

    setValueEnd(price);
};

const setValueEnd = (price) => (valueEnd.textContent = formatCurrency(price));

const addItemToCart = () => {
    food.ingredients = addIngredientsList();

    cart.push(food);
    showModal("Item Adicionado!", "#00b400");

    ingredients.querySelectorAll("input").forEach((cb) => (cb.checked = false));

    lengthCart.textContent = cart.length;
    fullReset();
};

const addIngredientsList = (inputs) => {
    const ingredientsList = [];
    ingredients.querySelectorAll("input").forEach((cb) => {
        if (cb.checked) {
            const ingredient = cb.id
                .replace("-", " ")
                .replace("savorys", "")
                .replace("candy", "");
            ingredientsList.push(ingredient);
        }
    });
    return ingredientsList;
};

const showItemsCart = () => {
    overlay.classList.remove("hide");
    cartItems.classList.remove("hide");
    body.classList.add("no-scroll");

    listItems.innerHTML = "";

    cart.forEach((item, index) => {
        const itemElement = document.createElement("li");
        itemElement.classList.add("item");

        let ingredientsList = "";

        if (item?.ingredients?.length > 0) {
            let string = "";
            item.ingredients?.forEach((text) => {
                string += `${text}. `;
            });

            ingredientsList = `<p> Adicionais: ${string}`;
            string = "";
        }

        const price = formatNumber(item.price);

        itemElement.innerHTML = `
            <div class="infos">
                    <h3 class="name-item">
                        ${item.name}
                    <span class="price-item">${formatCurrency(price)}</span>
                    </h3>
                    ${ingredientsList}
            </div>
        `;

        const remove = document.createElement("button");
        remove.classList.add("remove-item");
        remove.textContent = "Remover";

        remove.addEventListener("click", () => {
            removeItem(index);
        });

        itemElement.appendChild(remove);

        listItems.appendChild(itemElement);
    });

    lengthCart.textContent = cart.length;
    calulationTotalValue();
};

const removeItem = (index) => {
    cart.splice(index, 1);

    showItemsCart();

    calulationTotalValue();
};

const calulationTotalValue = () => {
    const value = cart.reduce(
        (count, value) => count + formatNumber(value.price),
        0
    );

    updateTotalValue(value);
};

const updateTotalValue = (price) => {
    totalValue.textContent = formatCurrency(price + 3);
    detailsTotal.querySelector(".food").textContent = formatCurrency(price);
};

const confirmToFood = () => {
    if (!isOpen) {
        showModal("Creperia fechada!", "#ff2828");
        return;
    }

    if (formatNumber(totalValue.textContent) == 3) {
        showModal("Carrinho vazio.", "#ff2828");
        return;
    }

    if (nameClient.value == "") {
        nameClient.nextElementSibling.classList.add("show");
        return;
    }

    nameClient.nextElementSibling.classList.remove("show");

    if (adressClient.value == "") {
        adressClient.nextElementSibling.classList.add("show");
        return;
    }

    adressClient.nextElementSibling.classList.remove("show");

    const pagamet = pagamentClient.options[pagamentClient.selectedIndex].text;

    if (pagamet == "") {
        pagamentClient.nextElementSibling.classList.add("show");
        return;
    }

    const name = nameClient.value;
    const adress = adressClient.value;
    const food = getFood();
    console.log(getFood());

    const message = `Boa noite! Me chamo ${name} e gostaria de fazer uma pedido;\n\nPedido: ${food};\n\nNo valor final de: ${totalValue.textContent};\n\nPara o endereço: ${adress};\n\nForma de pagamento: ${pagamet}`;

    sendMessage(message);

    window.location.reload();
};

const sendMessage = (message) => {
    const messageFormat = encodeURIComponent(message);
    const phone = 5583996675663;

    window.open(`https://wa.me/${phone}?text=${messageFormat}`);
};

const getFood = () => {
    let foodItems = "";

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    cart.map((item) => {
        let add = "";

        if (item.ingredients?.length > 0) {
            const items = item.ingredients.map((ingredient) => {
                return `${ingredient}`;
            });

            add = ` Adicionais: (${items}).`;
        }

        foodItems += `\n${capitalize(item.name)}, ${add} Preço: ${item.price}`;
    });

    return foodItems;
};

const showModal = (message, color) => {
    clearInterval(time);
    modal.classList.add("show");
    modal.style.backgroundColor = color;
    text.textContent = message;
    time = setTimeout(() => {
        modal.classList.remove("show");
    }, 2000);
};

// EVENTOS
confirmFood.addEventListener("click", confirmToFood);

main.addEventListener("click", ({ target }) => {
    if (!isOpen) {
        showModal("Creperia fechada!", "#ff2828");
        return;
    }
    const btn = target;
    if (!btn.classList.contains("add-cart")) return;
    showAddIngredients(btn);
});

navigationButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const pageActive = "section." + this.getAttribute("data-category");

        document.querySelector("li.active").classList.remove("active");
        document.querySelector("section.active").classList.remove("active");

        this.classList.add("active");
        document.querySelector(pageActive).classList.add("active");
    });
});

overlay.addEventListener("click", function ({ target }) {
    if (this != target || !addIngredients.classList.contains("hide")) return;
    fullReset();
});

confirmAddCart.addEventListener("click", addItemToCart);

buttonCart.addEventListener("click", showItemsCart);

totalValueButton.addEventListener("click", () =>
    detailsTotal.classList.toggle("show")
);

hour.className = isOpen ? "open" : "close";
