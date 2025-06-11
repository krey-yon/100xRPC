// Content script for additional page interaction tracking
let pageStartTime = Date.now();

const data = [
  {
    childDiv: 1,
    linkIndex: 1,
    title: "1.1 | Web Dev + Devops Orientation",
    url: "https://app.100xdevs.com/courses/14/411/412",
    relativePath: "/courses/14/411/412",
    isCompleted: true,
    hasBookmark: true,
    id: 1,
  },
  {
    childDiv: 1,
    linkIndex: 2,
    title: "1.2 | Basics of Javascript (4th Aug, 2024)",
    url: "https://app.100xdevs.com/courses/14/411/421",
    relativePath: "/courses/14/411/421",
    isCompleted: true,
    hasBookmark: true,
    id: 2,
  },
  {
    childDiv: 2,
    linkIndex: 1,
    title: "Intro, Setting up your IDE",
    url: "https://app.100xdevs.com/courses/14/417/418",
    relativePath: "/courses/14/417/418",
    isCompleted: true,
    hasBookmark: true,
    id: 3,
  },
  {
    childDiv: 2,
    linkIndex: 2,
    title: "HTML Basics (Tags and Attributes)",
    url: "https://app.100xdevs.com/courses/14/417/419",
    relativePath: "/courses/14/417/419",
    isCompleted: true,
    hasBookmark: true,
    id: 4,
  },
  {
    childDiv: 2,
    linkIndex: 3,
    title: "CSS Basics",
    url: "https://app.100xdevs.com/courses/14/417/420",
    relativePath: "/courses/14/417/420",
    isCompleted: true,
    hasBookmark: true,
    id: 5,
  },
  {
    childDiv: 3,
    linkIndex: 1,
    title: "1.1 | Async JS (11th Aug 2024)",
    url: "https://app.100xdevs.com/courses/14/430/431",
    relativePath: "/courses/14/430/431",
    isCompleted: true,
    hasBookmark: true,
    id: 6,
  },
  {
    childDiv: 3,
    linkIndex: 2,
    title: "Promises (12th Aug 2023)",
    url: "https://app.100xdevs.com/courses/14/430/432",
    relativePath: "/courses/14/430/432",
    isCompleted: true,
    hasBookmark: true,
    id: 7,
  },
  {
    childDiv: 4,
    linkIndex: 1,
    title: "1. Bash and Terminals (Basics)",
    url: "https://app.100xdevs.com/courses/14/435/436",
    relativePath: "/courses/14/435/436",
    isCompleted: true,
    hasBookmark: true,
    id: 8,
  },
  {
    childDiv: 4,
    linkIndex: 2,
    title: "2. Bash Advance (Laisha)",
    url: "https://app.100xdevs.com/courses/14/435/437",
    relativePath: "/courses/14/435/437",
    isCompleted: true,
    hasBookmark: true,
    id: 9,
  },
  {
    childDiv: 4,
    linkIndex: 3,
    title: "3. Installing Node.js, How to solve an assignment",
    url: "https://app.100xdevs.com/courses/14/435/438",
    relativePath: "/courses/14/435/438",
    isCompleted: true,
    hasBookmark: true,
    id: 10,
  },
  {
    childDiv: 4,
    linkIndex: 4,
    title: "4. Solving VSCode Assignment",
    url: "https://app.100xdevs.com/courses/14/435/439",
    relativePath: "/courses/14/435/439",
    isCompleted: true,
    hasBookmark: true,
    id: 11,
  },
  {
    childDiv: 4,
    linkIndex: 5,
    title: "5. Callback hell, Rejects and async/await",
    url: "https://app.100xdevs.com/courses/14/435/440",
    relativePath: "/courses/14/435/440",
    isCompleted: true,
    hasBookmark: true,
    id: 12,
  },
  {
    childDiv: 5,
    linkIndex: 1,
    title: "3.1 | DOM (Simple)",
    url: "https://app.100xdevs.com/courses/14/446/447",
    relativePath: "/courses/14/446/447",
    isCompleted: true,
    hasBookmark: true,
    id: 13,
  },
  {
    childDiv: 5,
    linkIndex: 2,
    title: "3.2 | DOM (Advance)",
    url: "https://app.100xdevs.com/courses/14/446/449",
    relativePath: "/courses/14/446/449",
    isCompleted: true,
    hasBookmark: true,
    id: 14,
  },
  {
    childDiv: 6,
    linkIndex: 1,
    title: "4.1 | Node.js, Bun and JS runtimes",
    url: "https://app.100xdevs.com/courses/14/450/451",
    relativePath: "/courses/14/450/451",
    isCompleted: true,
    hasBookmark: true,
    id: 15,
  },
  {
    childDiv: 6,
    linkIndex: 2,
    title: "4.2 | HTTP Servers",
    url: "https://app.100xdevs.com/courses/14/450/454",
    relativePath: "/courses/14/450/454",
    isCompleted: true,
    hasBookmark: true,
    id: 16,
  },
  {
    childDiv: 7,
    linkIndex: 1,
    title: "Express and HTTP server | Postman",
    url: "https://app.100xdevs.com/courses/14/452/453",
    relativePath: "/courses/14/452/453",
    isCompleted: false,
    hasBookmark: true,
    id: 17,
  },
  {
    childDiv: 7,
    linkIndex: 2,
    title: "Middleware",
    url: "https://app.100xdevs.com/courses/14/452/457",
    relativePath: "/courses/14/452/457",
    isCompleted: false,
    hasBookmark: true,
    id: 18,
  },
  {
    childDiv: 8,
    linkIndex: 1,
    title: "5.1 | Headers, Query params and Express",
    url: "https://app.100xdevs.com/courses/14/466/467",
    relativePath: "/courses/14/466/467",
    isCompleted: false,
    hasBookmark: true,
    id: 19,
  },
  {
    childDiv: 8,
    linkIndex: 2,
    title: "5.2 | Middlewares and cors",
    url: "https://app.100xdevs.com/courses/14/466/468",
    relativePath: "/courses/14/466/468",
    isCompleted: false,
    hasBookmark: true,
    id: 20,
  },
  {
    childDiv: 9,
    linkIndex: 1,
    title: "Git and Github",
    url: "https://app.100xdevs.com/courses/14/475/476",
    relativePath: "/courses/14/475/476",
    isCompleted: true,
    hasBookmark: true,
    id: 21,
  },
  {
    childDiv: 9,
    linkIndex: 2,
    title: "Map, Filter and Arrow fns",
    url: "https://app.100xdevs.com/courses/14/475/477",
    relativePath: "/courses/14/475/477",
    isCompleted: true,
    hasBookmark: true,
    id: 22,
  },
  {
    childDiv: 9,
    linkIndex: 3,
    title: "Axios vs Fetch",
    url: "https://app.100xdevs.com/courses/14/475/478",
    relativePath: "/courses/14/475/478",
    isCompleted: true,
    hasBookmark: true,
    id: 23,
  },
  {
    childDiv: 10,
    linkIndex: 1,
    title: "6.1 | HTTP Deep dive",
    url: "https://app.100xdevs.com/courses/14/482/483",
    relativePath: "/courses/14/482/483",
    isCompleted: false,
    hasBookmark: true,
    id: 24,
  },
  {
    childDiv: 10,
    linkIndex: 2,
    title: "6.2 | Auth and connecting FE to BE",
    url: "https://app.100xdevs.com/courses/14/482/484",
    relativePath: "/courses/14/482/484",
    isCompleted: false,
    hasBookmark: true,
    id: 25,
  },
  {
    childDiv: 11,
    linkIndex: 1,
    title: "JWT and Auth Recap",
    url: "https://app.100xdevs.com/courses/14/487/488",
    relativePath: "/courses/14/487/488",
    isCompleted: false,
    hasBookmark: true,
    id: 26,
  },
  {
    childDiv: 11,
    linkIndex: 2,
    title: "Mongo Installation",
    url: "https://app.100xdevs.com/courses/14/487/489",
    relativePath: "/courses/14/487/489",
    isCompleted: false,
    hasBookmark: true,
    id: 27,
  },
  {
    childDiv: 12,
    linkIndex: 1,
    title: "7.1 | MongoDB",
    url: "https://app.100xdevs.com/courses/14/492/493",
    relativePath: "/courses/14/492/493",
    isCompleted: false,
    hasBookmark: true,
    id: 28,
  },
  {
    childDiv: 12,
    linkIndex: 2,
    title: "7.2 | Passwords, zod",
    url: "https://app.100xdevs.com/courses/14/492/495",
    relativePath: "/courses/14/492/495",
    isCompleted: false,
    hasBookmark: true,
    id: 29,
  },
  {
    childDiv: 13,
    linkIndex: 1,
    title: "8,1 | Backend of Course selling app",
    url: "https://app.100xdevs.com/courses/14/505/506",
    relativePath: "/courses/14/505/506",
    isCompleted: false,
    hasBookmark: true,
    id: 30,
  },
  {
    childDiv: 13,
    linkIndex: 2,
    title: "8.2 | Backend of Course selling app - Part 2",
    url: "https://app.100xdevs.com/courses/14/505/508",
    relativePath: "/courses/14/505/508",
    isCompleted: false,
    hasBookmark: true,
    id: 31,
  },
  {
    childDiv: 14,
    linkIndex: 1,
    title: "Mongo Deep dive",
    url: "https://app.100xdevs.com/courses/14/509/510",
    relativePath: "/courses/14/509/510",
    isCompleted: false,
    hasBookmark: true,
    id: 32,
  },
  {
    childDiv: 15,
    linkIndex: 1,
    title: "9.1 | React Basics",
    url: "https://app.100xdevs.com/courses/14/513/514",
    relativePath: "/courses/14/513/514",
    isCompleted: false,
    hasBookmark: true,
    id: 33,
  },
  {
    childDiv: 15,
    linkIndex: 2,
    title: "9.2 | React useState",
    url: "https://app.100xdevs.com/courses/14/513/515",
    relativePath: "/courses/14/513/515",
    isCompleted: false,
    hasBookmark: true,
    id: 34,
  },
  {
    childDiv: 15,
    linkIndex: 3,
    title: "9.3 (recorded) - React from basics",
    url: "https://app.100xdevs.com/courses/14/513/521",
    relativePath: "/courses/14/513/521",
    isCompleted: false,
    hasBookmark: true,
    id: 35,
  },
  {
    childDiv: 15,
    linkIndex: 4,
    title: "9.4 | React from basics (Part 2)",
    url: "https://app.100xdevs.com/courses/14/513/522",
    relativePath: "/courses/14/513/522",
    isCompleted: false,
    hasBookmark: true,
    id: 36,
  },
  {
    childDiv: 16,
    linkIndex: 1,
    title: "10.1 | React Part 2. (SPAs, routing)",
    url: "https://app.100xdevs.com/courses/14/516/519",
    relativePath: "/courses/14/516/519",
    isCompleted: false,
    hasBookmark: true,
    id: 37,
  },
  {
    childDiv: 16,
    linkIndex: 2,
    title: "React Part 3 (Context API, Rolling up the state)",
    url: "https://app.100xdevs.com/courses/14/516/520",
    relativePath: "/courses/14/516/520",
    isCompleted: false,
    hasBookmark: true,
    id: 38,
  },
  {
    childDiv: 17,
    linkIndex: 1,
    title: "11.1 | Custom Hooks",
    url: "https://app.100xdevs.com/courses/14/532/533",
    relativePath: "/courses/14/532/533",
    isCompleted: false,
    hasBookmark: true,
    id: 39,
  },
  {
    childDiv: 17,
    linkIndex: 2,
    title: "11.2 | Recoil",
    url: "https://app.100xdevs.com/courses/14/532/534",
    relativePath: "/courses/14/532/534",
    isCompleted: false,
    hasBookmark: true,
    id: 40,
  },
  {
    childDiv: 17,
    linkIndex: 3,
    title: "11.3 | offline | Recoil Deep Dive",
    url: "https://app.100xdevs.com/courses/14/532/560",
    relativePath: "/courses/14/532/560",
    isCompleted: false,
    hasBookmark: false,
    id: 41,
  },
  {
    childDiv: 17,
    linkIndex: 4,
    title: "11.3 | offline | Recoil Deep Dive",
    url: "https://app.100xdevs.com/courses/14/532/561",
    relativePath: "/courses/14/532/561",
    isCompleted: false,
    hasBookmark: true,
    id: 42,
  },
  {
    childDiv: 18,
    linkIndex: 1,
    title: "12.2 | Ui/Ux Primitives by Keshav - Part 2",
    url: "https://app.100xdevs.com/courses/14/557/558",
    relativePath: "/courses/14/557/558",
    isCompleted: false,
    hasBookmark: true,
    id: 43,
  },
  {
    childDiv: 18,
    linkIndex: 2,
    title: "12.1 | Ui/Ux Primitives by Keshav - Part 1",
    url: "https://app.100xdevs.com/courses/14/557/559",
    relativePath: "/courses/14/557/559",
    isCompleted: false,
    hasBookmark: true,
    id: 44,
  },
  {
    childDiv: 19,
    linkIndex: 1,
    title: "Week 13.1 | Tailwind, ref arrays and building components",
    url: "https://app.100xdevs.com/courses/14/576/597",
    relativePath: "/courses/14/576/597",
    isCompleted: false,
    hasBookmark: true,
    id: 45,
  },
  {
    childDiv: 19,
    linkIndex: 2,
    title: "Week 13.2 | Tailwind Part 2, Creating sidebars",
    url: "https://app.100xdevs.com/courses/14/576/598",
    relativePath: "/courses/14/576/598",
    isCompleted: false,
    hasBookmark: true,
    id: 46,
  },
  {
    childDiv: 20,
    linkIndex: 1,
    title: "Week 14.1 | Typescript Part 1",
    url: "https://app.100xdevs.com/courses/14/579/599",
    relativePath: "/courses/14/579/599",
    isCompleted: false,
    hasBookmark: true,
    id: 47,
  },
  {
    childDiv: 20,
    linkIndex: 2,
    title: "Week 14.2 | Types, Interfaces and implementing interfaces",
    url: "https://app.100xdevs.com/courses/14/579/600",
    relativePath: "/courses/14/579/600",
    isCompleted: false,
    hasBookmark: true,
    id: 48,
  },
  {
    childDiv: 20,
    linkIndex: 3,
    title: "Week 14.3 | Typescript Advance APIs",
    url: "https://app.100xdevs.com/courses/14/579/601",
    relativePath: "/courses/14/579/601",
    isCompleted: false,
    hasBookmark: true,
    id: 49,
  },
  {
    childDiv: 21,
    linkIndex: 1,
    title:
      "Week 15.1 | End to end app in typescript - building a second brain app",
    url: "https://app.100xdevs.com/courses/14/583/602",
    relativePath: "/courses/14/583/602",
    isCompleted: false,
    hasBookmark: true,
    id: 50,
  },
  {
    childDiv: 21,
    linkIndex: 2,
    title: "Week 15.2|Creating a UI Library, Button component.",
    url: "https://app.100xdevs.com/courses/14/583/603",
    relativePath: "/courses/14/583/603",
    isCompleted: false,
    hasBookmark: true,
    id: 51,
  },
  {
    childDiv: 21,
    linkIndex: 3,
    title: "15.3 | Brainly end to end",
    url: "https://app.100xdevs.com/courses/14/583/604",
    relativePath: "/courses/14/583/604",
    isCompleted: false,
    hasBookmark: true,
    id: 52,
  },
  {
    childDiv: 22,
    linkIndex: 1,
    title: "Week 16.1 | Websockets",
    url: "https://app.100xdevs.com/courses/14/605/606",
    relativePath: "/courses/14/605/606",
    isCompleted: false,
    hasBookmark: true,
    id: 53,
  },
  {
    childDiv: 22,
    linkIndex: 2,
    title: "16.2 | WebSockets Project - Chat app",
    url: "https://app.100xdevs.com/courses/14/605/607",
    relativePath: "/courses/14/605/607",
    isCompleted: false,
    hasBookmark: true,
    id: 54,
  },
  {
    childDiv: 23,
    linkIndex: 1,
    title: "Week 17.1 | Postgres and SQL databases",
    url: "https://app.100xdevs.com/courses/14/608/609",
    relativePath: "/courses/14/608/609",
    isCompleted: false,
    hasBookmark: true,
    id: 55,
  },
  {
    childDiv: 23,
    linkIndex: 2,
    title: "Week 17.2 | Postgres and SQL databases - Part 2",
    url: "https://app.100xdevs.com/courses/14/608/610",
    relativePath: "/courses/14/608/610",
    isCompleted: false,
    hasBookmark: true,
    id: 56,
  },
  {
    childDiv: 24,
    linkIndex: 1,
    title: "18.1 | Prisma and ORMs",
    url: "https://app.100xdevs.com/courses/14/620/621",
    relativePath: "/courses/14/620/621",
    isCompleted: false,
    hasBookmark: true,
    id: 57,
  },
  {
    childDiv: 24,
    linkIndex: 2,
    title: "18.2 | Prisma advanced, Inrtoducing SSR",
    url: "https://app.100xdevs.com/courses/14/620/622",
    relativePath: "/courses/14/620/622",
    isCompleted: false,
    hasBookmark: true,
    id: 58,
  },
  {
    childDiv: 25,
    linkIndex: 1,
    title: "19.1 |  NextJS continuation",
    url: "https://app.100xdevs.com/courses/14/627/628",
    relativePath: "/courses/14/627/628",
    isCompleted: false,
    hasBookmark: true,
    id: 59,
  },
  {
    childDiv: 26,
    linkIndex: 1,
    title: "20.1 | Next.js Continued",
    url: "https://app.100xdevs.com/courses/14/638/639",
    relativePath: "/courses/14/638/639",
    isCompleted: false,
    hasBookmark: true,
    id: 60,
  },
  {
    childDiv: 26,
    linkIndex: 2,
    title: "20.2 | NextAuth",
    url: "https://app.100xdevs.com/courses/14/638/640",
    relativePath: "/courses/14/638/640",
    isCompleted: false,
    hasBookmark: true,
    id: 61,
  },
  {
    childDiv: 27,
    linkIndex: 1,
    title: "21.1 | Mono repos and turborepo",
    url: "https://app.100xdevs.com/courses/14/641/642",
    relativePath: "/courses/14/641/642",
    isCompleted: false,
    hasBookmark: true,
    id: 62,
  },
  {
    childDiv: 27,
    linkIndex: 2,
    title: "21.2 | Monorepos Continued",
    url: "https://app.100xdevs.com/courses/14/641/649",
    relativePath: "/courses/14/641/649",
    isCompleted: false,
    hasBookmark: true,
    id: 63,
  },
  {
    childDiv: 28,
    linkIndex: 1,
    title: "21.3 | CSR vs SSR vs Static Site Generation",
    url: "https://app.100xdevs.com/courses/14/645/646",
    relativePath: "/courses/14/645/646",
    isCompleted: false,
    hasBookmark: true,
    id: 64,
  },
  {
    childDiv: 28,
    linkIndex: 2,
    title: "21.4 | Building PayTM Project",
    url: "https://app.100xdevs.com/courses/14/645/647",
    relativePath: "/courses/14/645/647",
    isCompleted: false,
    hasBookmark: true,
    id: 65,
  },
  {
    childDiv: 28,
    linkIndex: 3,
    title: "21.5 | PayTM Frontend",
    url: "https://app.100xdevs.com/courses/14/645/648",
    relativePath: "/courses/14/645/648",
    isCompleted: false,
    hasBookmark: true,
    id: 66,
  },
  {
    childDiv: 29,
    linkIndex: 1,
    title: "22.1 | End to End - Project #1 - Excalidraw",
    url: "https://app.100xdevs.com/courses/14/662/663",
    relativePath: "/courses/14/662/663",
    isCompleted: false,
    hasBookmark: true,
    id: 67,
  },
  {
    childDiv: 29,
    linkIndex: 2,
    title: "22.2 | End to End - Project #1 - Part 2",
    url: "https://app.100xdevs.com/courses/14/662/664",
    relativePath: "/courses/14/662/664",
    isCompleted: false,
    hasBookmark: true,
    id: 68,
  },
  {
    childDiv: 30,
    linkIndex: 1,
    title: "23.1 | Excalidraw Part - 3",
    url: "https://app.100xdevs.com/courses/14/665/666",
    relativePath: "/courses/14/665/666",
    isCompleted: false,
    hasBookmark: true,
    id: 69,
  },
  {
    childDiv: 30,
    linkIndex: 2,
    title: "23.2 | Excalidraw Part - 4",
    url: "https://app.100xdevs.com/courses/14/665/667",
    relativePath: "/courses/14/665/667",
    isCompleted: false,
    hasBookmark: true,
    id: 70,
  },
];

// Function to find course by URL
function findCourseByUrl(url) {
  // Extract relative path from URL
  const urlObj = new URL(url);
  const relativePath = urlObj.pathname;

  // Find matching course in data
  return data.find((course) => course.relativePath === relativePath);
}

// Function to check if user is on 100xdevs website
function is100xDevsWebsite(url) {
  return url.includes("app.100xdevs.com");
}

// Function to check if user is on a specific course page
function is100xDevsCourse(url) {
  return url.includes("app.100xdevs.com/courses/");
}

// Send page activity to background script - ONLY for 100xdevs
function sendPageActivity() {
  const currentUrl = window.location.href;

  // Only send activity if on 100xdevs website
  if (!is100xDevsWebsite(currentUrl)) {
    // Clear presence when not on 100xdevs
    chrome.runtime.sendMessage({
      type: "clearPresence",
    });
    return;
  }

  let activity;

  // Check if user is on a specific course page
  if (is100xDevsCourse(currentUrl)) {
    const course = findCourseByUrl(currentUrl);

    if (course) {
      // User is watching a specific lecture
      activity = {
        details: `Watching ${course.title}`,
        state: "100xDevs Cohort 3.0",
        url: currentUrl,
        title: `Watching: ${course.title}`,
        startTime: pageStartTime,
        largeImageKey: "100xdevs",
        largeImageText: "100xDevs",
        smallImageKey: "video",
        smallImageText: "Learning",
        buttons: [
          {
            label: "View Lecture",
            url: currentUrl,
          },
          {
            label: "Visit 100xDevs",
            url: "https://app.100xdevs.com",
          },
        ],
      };
    } else {
      // User is on a course page but not recognized
      activity = {
        details: "Watching Lecture",
        state: "100xDevs Cohort 3.0",
        url: currentUrl,
        title: "Watching 100xDevs Lecture",
        startTime: pageStartTime,
        largeImageKey: "100xdevs",
        largeImageText: "100xDevs",
        smallImageKey: "video",
        smallImageText: "Learning",
      };
    }
  } else {
    // User is on 100xdevs but not a specific course (dashboard, profile, etc.)
    activity = {
      details: "Browsing 100xDevs Platform",
      state: "Cohort 3.0",
      url: currentUrl,
      title: document.title,
      startTime: pageStartTime,
      largeImageKey: "100xdevs",
      largeImageText: "100xDevs",
      smallImageKey: "browse",
      smallImageText: "Browsing",
      buttons: [
        {
          label: "Visit 100xDevs",
          url: "https://app.100xdevs.com",
        },
      ],
    };
  }

  chrome.runtime.sendMessage({
    type: "pageActivity",
    activity: activity,
  });
}

// Track page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden (tab switched or window minimized)
    console.log("Page is hidden, clearing presence");
    chrome.runtime.sendMessage({
      type: "clearPresence",
    });
  } else {
    // Page is visible again
    pageStartTime = Date.now();
    sendPageActivity();
  }
});

// Track URL changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    pageStartTime = Date.now();
    sendPageActivity();
  }
}).observe(document, { subtree: true, childList: true });

// Initial activity send
sendPageActivity();

// Clear presence when leaving the page
window.addEventListener("beforeunload", () => {
  console.log("Page is being unloaded, clearing presence");
  chrome.runtime.sendMessage({
    type: "clearPresence",
  });
});

// Clear presence when page loses focus
window.addEventListener("blur", () => {
  console.log("Window lost focus, clearing presence");
  chrome.runtime.sendMessage({
    type: "clearPresence",
  });
});

// Restore presence when page gains focus (if still on 100xdevs)
window.addEventListener("focus", () => {
  if (is100xDevsWebsite(window.location.href)) {
    console.log("Window gained focus on 100xdevs, restoring presence");
    pageStartTime = Date.now();
    sendPageActivity();
  }
});

const sendDataToBackend = (data) => {
  // Only send data if on 100xdevs website
  if (!is100xDevsWebsite(window.location.href)) {
    return;
  }

  // Send user activity data to the backend server
  fetch("http://localhost:7832/api/activity", {
    // Updated unique port
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Data sent to backend:", responseData);
    })
    .catch((error) => {
      console.error("Error sending data to backend:", error);
    });
};

// Function to collect user activity data - only for 100xdevs
const collectUserActivity = () => {
  if (!is100xDevsWebsite(window.location.href)) {
    return;
  }

  const activityData = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
  };
  sendDataToBackend(activityData);
};

// Listen for changes in the webpage (e.g., navigation) - only for 100xdevs
if (is100xDevsWebsite(window.location.href)) {
  window.addEventListener("load", collectUserActivity);
  window.addEventListener("popstate", collectUserActivity);
}
