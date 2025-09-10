const formatNumber = (price) => {
    price = price.replace(/\D/g, "");
    return Number.parseInt(price) / 100;
};

const formatCurrency = (price) => {
    return price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    });
};

export { formatNumber, formatCurrency };
