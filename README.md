# UpLearn Video Skipper

**UpLearn Video Skipper** is some JavaScript code designed to help users skip through video lessons on UpLearn and go straight to the questions, saving time by avoiding the need to watch the entire video if they already know everything about that specific topic/video. The script locates the question times in a video and automatically skips to them.

## How It Works

In UpLearn video lessons, there are periodic in-video questions. This script uses the UpLearn API to fetch those questions and automatically skips to each question's corresponding timestamp in the video. When there are no more questions, the video will skip to the end.

## Features
- Skips directly to the in-video questions.
- Reduces time spent on watching unnecessary portions of the video.
- Easy to set up and use

## Warning & Info

- The setup instructions below involve the use of "Tampermonkey", a browser extension which is just one example of a userscript manager that can run custom code in your browser. Tampermonkey is widely trusted and not inherently dangerous, but beware of pasting random scripts from the internet into it. **Only use it to run scripts that you trust.**

- The instructions involve intercepting a bearer token that is used by the UpLearn web app to authenticate with the UpLearn server for information. This is possibly a breach of their terms of service and we must assume that they can, in theory, associate the requests you make using your token with your account itself.
  - **This issue can be entirely circumvented by creating a dummy UpLearn trial account in a private browsing session and grabbing a token from there.**
  - If you use [TempMail](https://temp-mail.org/) for a throwaway email address to create the account then the script's activity should not trace back to you.
  - Doing all this while using a VPN provides the ultimate protection, but is optional. 

## Instructions

Steps 1-4 are **1 time only setup steps** (unless your token expires then you may need to redo step 4)

1. **Install the "Tampermonkey" browser extension**

    - In Chrome: https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
    - In Firefox: https://addons.mozilla.org/en-GB/firefox/addon/tampermonkey/

2. **Copy & paste the contents of [`index.js`](https://github.com/jumbo1631/UpLearn-Video-Skipper/blob/b3ca9fc3e373559ad8f351ab4676b2c098cc8fa8/index.js) into a new Tampermonkey script**

    - At the top of index.js, click "Copy raw file"
    - Click on the Tampermonkey extension and click "Create new script..."
    - Paste and save

3. **In a new tab, open UpLearn and log in** (if you choose the extra safe route, open a new private browser and create and log into an UpLearn dummy free trial account) 

4. **Grab the UpLearn API bearer token** (if you choose the extra safe route, this token should be grabbed while logged into your dummy free trial account) 

    - Open the Developer Console:
        - In Chrome, press Ctrl + Shift + J (Windows) or Cmd + Option + J (Mac).
        - In Firefox, press Ctrl + Shift + K (Windows) or Cmd + Option + K (Mac).
        - If none of them work, try F12, Ctrl + Shift + I or right click on the page and click Inspect/Inspect Element.

    - Go to the "Network" tab
    - Now, refresh the webpage
    - Filter requests by the `web.uplearn.co.uk/api` URL
    - Click any result, and find the authorization header under "Request Headers". Right click it, then choose "Copy value".
    - Go back to the Tampermonkey script. Paste the value inside the double quotes next to API_BEARER_TOKEN.

5. **Go back to UpLearn** (your personal account):
    - A "Skip Video" button will appear on the page.

6. **Click "Skip Video"**:
    - Click the "Skip Video" button to start skipping through the video. The script will automatically navigate to each question's position in the video.

- ### About this script

This repo is a fork of [itsme12453/UpLearn Video Skipper](https://github.com/itsme12453/UpLearn-Video-Skipper). I have changed very little from that original script. Here are the notable changes which you can verify yourself:

    - Use of an intercepted bearer token to authenticate with the UpLearn API. This fixes an authentication issue.
    - Use of Tampermonkey rather than pasting Javascript into the developer console. Both are equally invasive, but Tampermonkey is more convenient, as it only requires setting up once.
    - Fixed a few logic errors, specifically resetting the state upon subsequent calls of `makeApiRequest`.
    - Added some error alerts.

## Disclaimer

This script is intended for personal use to enhance learning efficiency on UpLearn by skipping through parts **you already know**, not to skip homework!

---

### License

This project is open source and available under the [MIT License](LICENSE).
