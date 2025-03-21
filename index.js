// ==UserScript==
// @name         Up Learn Video Skip
// @namespace    http://tampermonkey.net/
// @version      2025-03-12
// @description  Skip videos efficiently on Up Learn, including those that contain intermittent questions.
// @author       jumbo1631
// @match        https://web.uplearn.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// ==/UserScript==


// ******************************************************************************

// This token should be of the form "Bearer some_long_alphanumeric_key"
// Refer to the documentation for where to get this.

const API_BEARER_TOKEN = "";

// ******************************************************************************

(function() {
    'use strict';

    const button = document.createElement("button");
    let video = document.querySelector("video");
    button.innerText = "Skip Video";
    button.style.position = "absolute";
    button.style.left = "10px";
    button.style.top = "100px";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px";
    button.style.cursor = "pointer";

    document.body.appendChild(button);

    let questionTimes = [];
    let nextTimeIndex = 0;
    let finished = false;

    function processTime(postQuestionResumeTime) {
        const timeString = postQuestionResumeTime.replace("PT", "");
        const timeParts = timeString.match(/(\d+)M(\d+\.\d+)S/);
        if (timeParts) {
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseFloat(timeParts[2]);
            const totalSeconds = Math.floor(minutes * 60 + seconds) - 1;
            questionTimes.push(totalSeconds);
            console.log(totalSeconds);
        } else {
            const seconds = parseFloat(timeString.replace("S", ""));
            const totalSeconds = Math.floor(seconds) - 1;
            questionTimes.push(totalSeconds);
            console.log(totalSeconds);
        }
    }

    const makeApiRequest = () => {

        questionTimes = [];
        nextTimeIndex = 0;
        finished = false;

        video = document.querySelector("video")

        if(!video) {
            alert('No video found on the current page');
            return;
        }

        const url = window.location.href;
        const urlParts = url.split('/');
        const moduleUniqueCode = urlParts[4];
        const subsectionUniqueCode = urlParts[5];
        const uniqueCode = urlParts[6];

        fetch("https://web.uplearn.co.uk/api/", {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "authorization": API_BEARER_TOKEN
            },
            credentials: "include",
            body: JSON.stringify({
                operationName: "GetVideoLesson",
                variables: {
                    moduleUniqueCode,
                    subsectionUniqueCode,
                    uniqueCode,
                    inVideoQuestionOrder: [{
                        field: "TRIGGER_TIME",
                        direction: "ASC"
                    }]
                },
                query: `
            query GetVideoLesson(
                $uniqueCode: String!,
                $subsectionUniqueCode: String!,
                $moduleUniqueCode: String!,
                $inVideoQuestionFilter: InVideoQuestionFilter,
                $inVideoQuestionOrder: [InVideoQuestionOrdering]
            ) {
                videoLesson(filter: {
                    uniqueCode: $uniqueCode,
                    subsectionUniqueCode: $subsectionUniqueCode,
                    moduleUniqueCode: $moduleUniqueCode
                }) {
                    id
                    inVideoQuizQuestions(
                        filter: $inVideoQuestionFilter,
                        order: $inVideoQuestionOrder
                    ) {
                        postQuestionResumeTime
                    }
                }
            }
            `
            }),
            method: "POST"
        })
            .then(response => {
            const statusCode = response.status;
            if(statusCode == 401 ) {
                alert('There was a problem authenticating. You may need to set - or refresh - the bearer token above. Refer to the documentation for details.');
                return;
            }
            else if(statusCode != 200) {
                alert('An unknown error occurred.');
                return;
            }
            return response.json();
        })
            .then(data => {

            if(data.errors && data.errors[0].message == 'unauthenticated'){
                alert('There was a problem authenticating. You may need to set - or refresh - the bearer token above. Refer to the documentation for details.');
                return;
            }

            const info = data.data.videoLesson.inVideoQuizQuestions;

            for (let question of info) {
                processTime(question.postQuestionResumeTime);
            }

            if (questionTimes.length > 0) {
                video.currentTime = questionTimes[nextTimeIndex];
            }

            video.addEventListener('timeupdate', () => {
                if (finished) { return; }
                const currentTime = video.currentTime;
                console.log("Current Time:", currentTime, "Next Time:", questionTimes[nextTimeIndex]);

                if (nextTimeIndex < questionTimes.length) {
                    if (currentTime - 2 >= questionTimes[nextTimeIndex]) {
                        console.log(`Skipping to: ${questionTimes[nextTimeIndex]} seconds`);
                        nextTimeIndex++;

                        if (nextTimeIndex < questionTimes.length) {
                            video.currentTime = questionTimes[nextTimeIndex] - 1;
                        } else {
                            console.log("No more questions. Skipping to the end of the video.");
                            video.currentTime = video.duration - 0.5;
                        }
                    }
                } else {
                    console.log("Next time index is out of bounds. Skipping to the end of the video.");
                    video.currentTime = video.duration - 0.5;
                }

                if (currentTime >= video.duration - 0.5) {
                    finished = true;
                    console.log("Reached near the end. Stopping playback.");
                }
            });
        })
            .catch(error => console.error("Error:", error));
    };

    button.addEventListener("click", makeApiRequest);

})();
