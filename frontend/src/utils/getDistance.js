import { getDistance } from "geolib";

const calculateDistance = (pointA, pointB) => {
    const distanceInMeters = getDistance(
        { latitude: pointA.lat, longitude: pointA.lng },
        { latitude: pointB.lat, longitude: pointB.lng }
    );

    if (distanceInMeters >= 1000) {
        const distanceInKm = (distanceInMeters / 1000).toFixed(2);
        return `${distanceInKm} km away`
    } else {
        return `${distanceInMeters} meter away`
    }
};

export default calculateDistance;