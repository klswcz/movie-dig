module.exports = {
    apps : [{
        name   : "moviedig",
        script : "./src/app.js",
        env    : {
            DB_HOST: "mongodb+srv://MovieRecommendationDB",
            DB_USER: "moviedig_user",
            DB_PASS: "",
            DB_ENV: "testing",
            APP_PORT: "8081",
            APP_URL: "https://moviedig.ap:8080",
            FRONTEND_APP_URL: "https://moviedig.app",
            JWT_SECRET: "",
            TMDB_API_KEY: ""
        }
    }]
}