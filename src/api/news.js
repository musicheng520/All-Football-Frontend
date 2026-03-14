import request from "./request";

/**
 * Get all news
 */
export const getNewsList = () => {
    return request({
        url: "/news",
        method: "GET"
    });
};

/**
 * Get news detail
 * @param {number} id
 */
export const getNewsDetail = (id) => {
    return request({
        url: `/news/${id}`,
        method: "GET"
    });
};

/**
 * Get news by team
 * @param {number} teamId
 */
export const getNewsByTeam = (teamId) => {
    return request({
        url: `/news/team/${teamId}`,
        method: "GET"
    });
};

/**
 * Get news by player
 * @param {number} playerId
 */
export const getNewsByPlayer = (playerId) => {
    return request({
        url: `/news/player/${playerId}`,
        method: "GET"
    });
};