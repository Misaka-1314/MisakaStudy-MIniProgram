export async function onRequestGet({ request, params, env }) {
    return fetch(
        `https://api.github.com/repos/Misaka-1314/MisakaStudy-MIniProgram/releases`, {
        "method": "GET",
        "headers": {
            "Authorization": `Bearer ${env.token}`,
            "User-Agent": "misaka-docs",
        },
    });
}
