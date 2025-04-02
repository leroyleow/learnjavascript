//https://www.phind.com/search/cm8y1w1vz0000356mktfygapz
//Simple Approach
const processItem = {
    name: 'product',
    price: 100,
    category: 'electronics'
};

function addTax(item) {
    item.price *= 1.2;
    return item;
}

function formatPrice(item) {
    item.price = `$${item.price.toFixed(2)}`;
    return item;
}

function categorize(item) {
    item.category = `${item.category.toUpperCase()}-ITEM`;
    return item;
}

// Processing chain
processItem = addTax(processItem);
processItem = formatPrice(processItem);
processItem = categorize(processItem);

//Complex Approach
class DataProcessor {
    constructor(data) {
        this.data = data;
    }

    transform(transformer) {
        this.data = transformer(this.data);
        return this;
    }
}

const processItem2 = new DataProcessor({
    name: 'product',
    price: 100,
    category: 'electronics'
});

// Chain transformations
processItem2
    .transform(item => ({ ...item, price: item.price * 1.2 }))
    .transform(item => ({
        ...item,
        price: `$${item.price.toFixed(2)}`
    }))
    .transform(item => ({
        ...item,
        category: `${item.category.toUpperCase()}-ITEM`
    }));