import request from "./request";

/**
 * Get comments by news id
 * @param {number} newsId
 */
export const getCommentsByNews = (newsId) => {
    return request({
        url: `/comments/news/${newsId}`,
        method: "GET"
    });
};

/**
 * Create comment
 * @param {Object} data
 */
export const createComment = (data) => {
    return request({
        url: "/comments",
        method: "POST",
        data
    });
};