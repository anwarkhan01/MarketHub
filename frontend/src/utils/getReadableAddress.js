const getReadableAddress = async (latitude, longitude) => {
    const apiKey = import.meta.env.VITE_OPENCAGEDATA_APIKEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            const address = data.results[0].formatted;
            return address;
        } else {
            throw new Error("No address found for the given coordinates.");
        }
    } catch (error) {
        console.error("Error fetching address:", error.message);
        return null;
    }
};

export default getReadableAddress