import { serviceProvider } from "../models/service_provider.model.js";


let cachedProfessions = [];

export async function loadProfessions() {
    try {
        const professions = await serviceProvider.distinct("profession");
        cachedProfessions = professions.map(p => p.toLowerCase().trim());
        console.log("Profession list:", cachedProfessions);
    } catch (error) {
        console.error("Error loading professions:", error);
    }
}

export function getCachedProfessions() {
    return cachedProfessions;
}
