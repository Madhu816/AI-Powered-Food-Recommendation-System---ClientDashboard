export const getFallbackImage = (itemId, images) => {
    if (!images.length) {
        return "1782828922625.jpg";
    }

    const id = String(itemId || "restaurant");
    const hash = [...id].reduce(
        (total, character) => total + character.charCodeAt(0),
        0
    );

    return images[hash % images.length];
};
