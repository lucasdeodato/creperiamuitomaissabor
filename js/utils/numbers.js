const formatCurrency = (price) => {
    return price.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    });
};

export { formatCurrency };
