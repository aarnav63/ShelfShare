export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MS_CLIENT_ID, 
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID}`,
        redirectUri: window.location.origin, // Works for both localhost and Vercel automatically
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: false,
    }
};

// Scopes are the permissions we are asking from the student
export const loginRequest = {
    scopes: ["User.Read"]
};