/* =====================================
   BIRTHDAY INVITE WEBSITE
   UTKARSH
===================================== */

const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbwEFEfHZtpm6QC_TEcU0WljO2ZUTLpFLJIJVBSnLWF1ET2s3ls6TMY54w70w9Mk43v8-A/exec";

let currentPage = 1;

let joined = false;
let excited = false;

let noJoinAttempts = 0;
let noExcitedAttempts = 0;

let selectedRating = "";

/* =====================================
   SESSION TRACKING
===================================== */

const sessionId =
    (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).substring(2);

let sessionReady = false;

function sendToSheet(action, extra = {}) {

    if (!sessionReady && action !== "start") {
        return;
    }

    fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: action,
            sessionId: sessionId,
            ...extra
        })
    }).catch(() => {
        console.log("Tracking failed");
    });
}


/* =====================================
   PAGE NAVIGATION
===================================== */

function showPage(pageNumber) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page =
        document.getElementById("page" + pageNumber);

    if (page) {
        page.classList.add("active");
    }

    currentPage = pageNumber;
}

function nextPage() {

    if (currentPage < 7) {
        showPage(currentPage + 1);
    }
}


/* =====================================
   JOIN QUESTION
===================================== */

function joinYes() {

    joined = true;

    sendToSheet("joined");

    document.getElementById("join-message").textContent =
        "GOOD CHOICE BRO 😎🔥";

    setTimeout(() => {
        nextPage();
    }, 700);
}

function noJoinAttempt() {

    noJoinAttempts++;

    sendToSheet("noJoin");

    const message =
        document.getElementById("join-message");

    message.textContent =
        "🚫 NICE TRY BRO 😂 NO IS NOT AVAILABLE!";

    moveNoButton("noJoinBtn");
}


/* =====================================
   EXCITEMENT QUESTION
===================================== */

function excitedYes() {

    excited = true;

    sendToSheet("excited");

    document.getElementById("excited-message").textContent =
        "THAT'S WHAT WE WANTED TO HEAR 🔥😎";

    setTimeout(() => {
        showPage(7);
    }, 800);
}

function noExcitedAttempt() {

    noExcitedAttempts++;

    sendToSheet("noExcited");

    const message =
        document.getElementById("excited-message");

    message.textContent =
        "😭 BRO JUST CLICK YES!";

    moveNoButton("noExcitedBtn");
}


/* =====================================
   MOVING NO BUTTON
===================================== */

function moveNoButton(buttonId) {

    const button =
        document.getElementById(buttonId);

    if (!button) return;

    const maxX =
        Math.min(
            window.innerWidth - button.offsetWidth - 20,
            400
        );

    const maxY =
        Math.min(
            window.innerHeight - button.offsetHeight - 20,
            300
        );

    const x =
        Math.random() *
        Math.max(maxX, 100) -
        Math.max(maxX, 100) / 2;

    const y =
        Math.random() *
        Math.max(maxY, 100) -
        Math.max(maxY, 100) / 2;

    button.style.transform =
        `translate(${x}px, ${y}px)`;
}


/* =====================================
   LOGOUT / ASSESSMENT COMPLETE
===================================== */

function logout() {

    sendToSheet("completed");

    createConfetti(180);

    setTimeout(() => {

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        document
            .getElementById("page8")
            .classList.add("active");

        currentPage = 8;

    }, 500);
}


/* =====================================
   FEEDBACK RATING
===================================== */

function selectRating(button, rating) {

    selectedRating = rating;

    document
        .querySelectorAll(".rating-btn")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    button.classList.add("selected");

    sendToSheet("rating", {
        rating: rating
    });

    document.getElementById("feedback-message").textContent =
        `Rating selected: ${rating} ❤️`;
}


/* =====================================
   SUBMIT FEEDBACK
===================================== */

function submitFeedback() {

    const feedback =
        document.getElementById("feedbackText").value.trim();

    const message =
        document.getElementById("feedback-message");

    if (!selectedRating) {

        message.textContent =
            "BROOO, RATING TO SELECT KARO 😂";

        return;
    }

    if (!feedback) {

        message.textContent =
            "Kuch toh likh bro 😭";

        return;
    }

    sendToSheet("feedback", {
        feedback: feedback
    });

    message.textContent =
        "FEEDBACK RECEIVED ❤️🔥";

    setTimeout(() => {

        logoutToFinal();

    }, 900);
}


/* =====================================
   GO TO FINAL PAGE
===================================== */

function logoutToFinal() {

    createConfetti(180);

    setTimeout(() => {

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        document
            .getElementById("finalPage")
            .classList.add("active");

        currentPage = 9;

    }, 500);
}


/* =====================================
   CONFETTI
===================================== */

function createConfetti(amount = 100) {

    const container =
        document.getElementById("confetti-container");

    if (!container) return;

    for (let i = 0; i < amount; i++) {

        const confetti =
            document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left =
            Math.random() * 100 + "%";

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + "s";

        confetti.style.animationDelay =
            Math.random() * 0.5 + "s";

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        const colors = [
            "#ffcf70",
            "#ff6b6b",
            "#6ee7ff",
            "#a78bfa",
            "#55e6a8",
            "#ffffff"
        ];

        confetti.style.background =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4500);
    }
}


/* =====================================
   START WEBSITE + CREATE SHEET ROW
===================================== */

window.addEventListener("load", () => {

    fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: "start",
            sessionId: sessionId
        })
    })
    .then(() => {
        sessionReady = true;
    })
    .catch(() => {
        console.log("Session tracking failed");
    });

    setTimeout(() => {
        createConfetti(120);
    }, 300);

});