// Variaeis
import { additional, produtos, deliveryAdress } from "./utils/data.js";
import { isOpen, isNearClose, hourOpen, hourClose } from "./utils/isOpen.js";
import { formatCurrency, sendMessage, clearText } from "./utils/changeDatas.js";

const body = document.body;
const main = document.querySelector("main");
const hour = document.querySelector("#hour");
const floatHour = document.querySelector("#float-hour");
const navigationButtons = document.querySelectorAll("#pages li");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cart");
const listItems = document.querySelector("#list-items-cart");
const buttonCart = document.querySelector("#button-cart");
const lengthCart = document.querySelector("#length-cart");
const nameClient = document.querySelector("#name-client");
const adressClient = document.querySelector("#adress-client");
const notAdress = document.querySelector("#not-adress");
const pagamentClient = document.querySelector("#pagament-client");
const deliveryPrice = document.querySelector("#price-delivery");
const totalValue = document.querySelector("#total-value");
const detailsTotal = document.querySelector("#details-total");
const addIngredients = document.querySelector("#add-ingredients");
const addList = document.querySelector("#list-add");
const valueEnd = document.querySelector("#value-end");
const confirmAddCart = document.querySelector("#confirm-add-cart");
const totalValueButton = document.querySelector("#total-value-button");
const confirmFood = document.querySelector("#confirm-food");
const modal = document.querySelector("#modal");
const text = document.querySelector("#text");
const checkBoxNotAdd = document.querySelector("#not-add");
const juyces = document.querySelector("#suco");

const cart = [];
let food = {};
let ingredients;
let time;
let pages;
let actualPrice;
let priceOrigin = 0;
let deliveryValue = 3;
let endValue = 0;
let adress;

const showProducts = () => {
    const createList = (list) => {
        const div = document.createElement("div");
        div.classList.add("list");

        list.forEach((card) => {
            const article = document.createElement("article");
            article.classList.add("card");
            const price = formatCurrency(card.preco);
            article.innerHTML = `
                    <div class="details">
                        <div class="image-card">
                            <img
                                src="${card.imagem}"
                                alt="${card.titulo}"
                            />
                        </div>
                        <div class="info">
                            <h3 class="name-crepe">
                                ${card.titulo}
                                <span class="price">${price}</span>
                            </h3>
                            <p class="description">
                                ${card.descricao}
                            </p>
                        </div>
                    </div>
                `;

            const button = document.createElement("button");
            button.classList.add("add-cart");
            button.innerHTML = `<i class="fas fa-cart-plus"></i>`;

            button.addEventListener("click", () => {
                showAddIngredients(card);
            });

            article.appendChild(button);

            div.appendChild(article);
        });

        return div;
    };

    produtos.forEach((produto) => {
        const section = document.createElement("section");
        section.innerHTML = `<h2>${produto.titulo}</h2>`;

        const list = createList(produto.produtos);
        section.appendChild(list);

        main.appendChild(section);
    });
};

const showAdd = () => {
    additional.forEach((itemAdd) => {
        const div = document.createElement("div");
        div.id = itemAdd.class;
        div.className = " hide";

        itemAdd.adds.forEach((item) => {
            const divAdd = document.createElement("div");
            divAdd.classList.add("add");

            const label = document.createElement("label");
            label.for = item.name;

            const spanName = document.createElement("span");
            spanName.textContent = item.name;
            label.appendChild(spanName);

            const spanPrice = document.createElement("span");
            spanPrice.innerHTML = `<span>${formatCurrency(item.price)}<span>`;

            const input = document.createElement("input");
            input.type = "checkbox";
            input.addEventListener("change", () => {
                calulation(input, item.price);
            });
            spanPrice.appendChild(input);

            label.appendChild(spanPrice);

            divAdd.appendChild(label);

            div.appendChild(divAdd);
        });

        addList.appendChild(div);
    });
};

// Reseta variaveis e retira elementos da tela
const fullReset = () => {
    overlay.classList.add("hide");
    body.classList.remove("no-scroll");
    addIngredients.classList.add("hide");
    ingredients?.classList.add("hide");
    cartItems.classList.add("hide");
    food = {};
};

// Mostra o modal e seus respequitivos adicionais
const showAddIngredients = (card) => {
    if (!isOpen) {
        showModal("Creperia fechada!", "#ff2828");
        return;
    }

    const category = card.categoria;
    const name = card.titulo;
    priceOrigin = card.preco;

    category;

    if (category == "refri") {
        ingredients = null;
    } else {
        ingredients = overlay.querySelector(`#${category}`);
    }

    ingredients;

    food.name = name;
    food.price = priceOrigin;
    food.category = category;

    if (ingredients) {
        if (ingredients.id == "suco") {
            addIngredients.classList.add("hide");
        } else {
            addIngredients.classList.remove("hide");
        }

        overlay.classList.remove("hide");
        body.classList.add("no-scroll");
        ingredients.classList.remove("hide");
    }

    addCart(ingredients, priceOrigin);
};

const addCart = (ingredients, price) => {
    if (!ingredients) {
        cart.push(food);
        "Carrinho: " + cart;
        showModal("Item Adicionado!", "#00b400");
        updateLengthCart();
        fullReset();
        return;
    }

    actualPrice = price;

    setValueEnd(price);
};

const calulation = (checkBox, price) => {
    const addPrice = price;

    const incrementValue = (value, increment) => {
        return value + increment;
    };

    const decrementValue = (value, decrement) => {
        return value - decrement;
    };

    if (checkBox.checked) {
        actualPrice = incrementValue(actualPrice, addPrice);
    } else {
        actualPrice = decrementValue(actualPrice, addPrice);
    }

    setValueEnd(actualPrice);
    food.price = actualPrice;
};

const setValueEnd = (price) => (valueEnd.textContent = formatCurrency(price));

const addItemToCart = () => {
    food.ingredients = addIngredientsList();

    if (checkBoxNotAdd.checked) {
        food.ingredients = [];
        food.price = priceOrigin;
    }

    cart.push(food);
    cart;
    showModal("Item Adicionado!", "#00b400");

    ingredients.querySelectorAll("input").forEach((cb) => {
        cb.checked = false;
        cb.disabled = false;
    });
    addList.classList.remove("disabled");
    checkBoxNotAdd.checked = false;

    updateLengthCart();
    fullReset();
};

const updateLengthCart = () => {
    lengthCart.textContent = cart.length;
};

const addIngredientsList = () => {
    let ingredientsList = [];
    ingredients.querySelectorAll("input").forEach((cb) => {
        if (cb.checked) {
            const ingredient =
                cb.parentElement.previousElementSibling.textContent;

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

            console.log(string);

            ingredientsList = `Adicionais: ${string.toLowerCase()}`;
            string = "";
        }

        itemElement.innerHTML = `
                <div class="infos">
                        <h3 class="name-item">
                            ${item.name}
                        <span class="price-item">${formatCurrency(
                            item.price
                        )}</span>
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

    updateLengthCart();
    calulationTotalValue();
};

const removeItem = (index) => {
    cart.splice(index, 1);

    showItemsCart();

    calulationTotalValue();
};

const calulationTotalValue = () => {
    const value = cart.reduce((count, value) => count + value.price, 0);

    updateTotalValue(value);
};

const updateTotalValue = (price) => {
    endValue = price + deliveryValue;
    totalValue.textContent = formatCurrency(endValue);
    detailsTotal.querySelector(".food").textContent = formatCurrency(price);
    detailsTotal.querySelector(".delivery").textContent =
        formatCurrency(deliveryValue);
};

const validationCart = () => {
    if (!isOpen) {
        showModal("Creperia fechada!", "#ff2828");
        return;
    }

    if (cart.length < 1) {
        showModal("Carrinho vazio.", "#ff2828");
        return;
    }

    const errorName = nameClient.nextElementSibling;
    const errorAdress = adressClient.nextElementSibling;
    const pagamet = pagamentClient.options[pagamentClient.selectedIndex].text;

    if (nameClient.value == "") {
        errorName.classList.add("show");
        return;
    }

    errorName.classList.remove("show");

    if (!notAdress.checked) {
        if (adressClient.value == "") {
            errorAdress.classList.add("show");
            return;
        }
    }

    errorAdress.classList.remove("show");

    if (pagamet == "") {
        pagamentClient.nextElementSibling.classList.add("show");
        return;
    }

    confirmToFood(pagamet);
};

const confirmToFood = (pagamet) => {
    const name = nameClient.value;
    adress = adressClient.value;
    const food = getFood();
    getFood();

    if (adress) {
        adress = "Para o endereço: " + adress;
    } else {
        adress = "Retirada no local";
    }

    const message = `Boa noite! Me chamo ${name} e gostaria de fazer um pedido;\n\nPedido:\n${food}\nNo valor final de: ${formatCurrency(
        endValue
    )};\n\n${adress};\n\nForma de pagamento: ${pagamet}`;

    sendMessage(message);

    window.location.reload();
};

const getFood = () => {
    let foodItems = "";

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        let add = "";

        if (item.ingredients?.length > 0) {
            const items = item.ingredients.map((ingredient) => {
                return ` ${ingredient}`;
            });

            add = ` Adicionais: (${items})`;
        }

        if (item.category != "bebidas") {
            foodItems += `*${i + 1}.* ${item.name} ${add}. ${formatCurrency(
                item.price
            )};\n`;
        } else {
            foodItems += `*${i + 1}.* ${
                capitalize(item.name) + add ? add[0] : add
            } ${formatCurrency(item.price)};\n`;
        }
    }

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

const observerHour = () => {
    if (!isNearClose) return;
    setInterval(() => {
        const date = new Date();
        const minutesOrClose = date.getMinutes();
        const seconds = date.getSeconds();
        const timeClose = 60 - minutesOrClose;

        if (timeClose <= 0) {
            floatHour.classList.remove("show");
            hour.className = "close";
            showModal("A creperia fechou!", "#ff2828");
            setTimeout(() => window.location.reload(), 2000);
        } else if (timeClose == 1) {
            floatHour.classList.add("show");
            floatHour.textContent = `Tempo restante: ${60 - seconds} segundos`;
        } else {
            floatHour.textContent = `Tempo restante: ${timeClose} minutos`;
        }
    }, 500);
};

// Feito por IA
const listenerHour = new IntersectionObserver((e) => {
    const isDisplay = e[0].isIntersecting;
    if (isDisplay) {
        floatHour.classList.remove("show");
    } else {
        floatHour.classList.add("show");
    }
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(pages).indexOf(entry.target);
                navigationButtons.forEach((btn) =>
                    btn.classList.remove("active")
                );
                navigationButtons[index].classList.add("active");
            }
        });
    },
    {
        root: main,
        threshold: 0.6, // 60% visível já conta como "ativa"
    }
);

// EVENTOS
confirmFood.addEventListener("click", validationCart);

// main.addEventListener("wheel", (e) => {
//     if (e.deltaY > 0 && currentIndex < pages.length - 1) {
//         currentIndex++;
//     } else if (e.deltaY < 0 && currentIndex > 0) {
//         currentIndex--;
//     }
//     pages[currentIndex].scrollIntoView({ behavior: "smooth" });
// });

navigationButtons.forEach((button, index) => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // evita scroll da página
        const targetPage = pages[index];
        main.scrollTo({
            left: targetPage.offsetLeft,
            behavior: "smooth",
        });
    });
});

adressClient.addEventListener("input", () => {
    const value = adressClient.value.toLowerCase();
    const isMoreValue = deliveryAdress.some((adress) => {
        const textClear = clearText(value);
        const addressClear = clearText(adress);
        if (textClear.includes(addressClear)) {
            return true;
        } else {
            return false;
        }
    });

    deliveryValue = isMoreValue ? 5 : 3;

    calulationTotalValue();
    deliveryPrice.textContent =
        value == "" ? "R$3,00 - R$5,00" : formatCurrency(deliveryValue);
});

checkBoxNotAdd.addEventListener("change", () => {
    const inpusts = ingredients.querySelectorAll("input");
    if (checkBoxNotAdd.checked) {
        addList.classList.add("disabled");
        inpusts.forEach((input) => (input.disabled = true));
    } else {
        addList.classList.remove("disabled");
        inpusts.forEach((input) => (input.disabled = false));
    }
    inpusts;
});

notAdress.addEventListener("change", () => {
    const boxInputAdress = adressClient.parentElement;
    const labelNotAdress = notAdress.parentElement;
    if (notAdress.checked) {
        deliveryValue = 0;
        adressClient.disabled = true;

        boxInputAdress.classList.add("disabled");
        labelNotAdress.style.color = "#000";
        calulationTotalValue();
        deliveryPrice.textContent = formatCurrency(deliveryValue);
        adressClient.value = "";
    } else {
        deliveryValue = 3;
        adressClient.disabled = false;

        boxInputAdress.classList.remove("disabled");
        labelNotAdress.style.color = "#444";
        calulationTotalValue();
        deliveryPrice.textContent = "R$3,00 - R$5,00";
    }
});

overlay.addEventListener("click", function ({ target }) {
    if (this != target || !addIngredients.classList.contains("hide")) return;
    fullReset();
});

juyces.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = juyces.querySelector("input:checked");

    food.ingredients = [input.value];

    cart.push(food);
    cart;
    showModal("Item Adicionado!", "#00b400");

    ingredients.querySelectorAll("input").forEach((rd) => {
        rd.checked = false;
    });

    updateLengthCart();
    fullReset();
});

confirmAddCart.addEventListener("click", addItemToCart);

buttonCart.addEventListener("click", showItemsCart);

totalValueButton.addEventListener("click", () =>
    detailsTotal.classList.toggle("show")
);

floatHour.className = isOpen ? "open" || floatHour : "close";
floatHour.textContent = isOpen ? "Aberto" || floatHour : "Fechado";
hour.textContent = `${hourOpen}:00 - ${hourClose}:00 | Qui - Sab`;
hour.className = isOpen ? "open" : "close";

listenerHour.observe(hour);

observerHour();

window.onload = () => {
    showProducts();

    pages = main.querySelectorAll("section");
    pages.forEach((section) => observer.observe(section));

    showAdd();
};
