import request from "./request";

export const followTeam = (teamId) => {
    return request({
        url: `/follows/${teamId}`,
        method: "POST"
    });
};

export const unfollowTeam = (teamId) => {
    return request({
        url: `/follows/${teamId}`,
        method: "DELETE"
    });
};

export const getMyFollows = () => {
    return request({
        url: "/follows/me",
        method: "GET"
    });
};