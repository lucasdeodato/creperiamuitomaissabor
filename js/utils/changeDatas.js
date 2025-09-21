const formatCurrency = (price) => {
    const strPrice = Number(price);
    return strPrice.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    });
};

const clearText = (text) => {
    return text
        .normalize("NFD") // separa os acentos dos caracteres
        .replace(/[\u0300-\u036f]/g, "") // remove os acentos
        .replace(/[^a-zA-Z0-9\s]/g, ""); // remove outros caracteres especiais
};

const sendMessage = (message) => {
    const messageFormat = encodeURIComponent(message);
    const phone = 5583996675663;

    window.open(`https://wa.me/${phone}?text=${messageFormat}`);
};

export { formatCurrency, sendMessage, clearText };
