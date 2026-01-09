const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");

const fetchWord = () => {
    let word = inpWord.value.trim();
    
    if (!word) {
        alert("Please enter a word first!");
        return;
    }

    result.innerHTML = `<p class="error">Loading...</p>`;

    fetch(`${url}${word}`)
        .then((response) => {
            if (!response.ok) throw new Error("Word not found");
            return response.json();
        })
        .then((data) => {
            const wordData = data[0];
            const meaning = wordData.meanings[0].definitions[0].definition;
            const example = wordData.meanings[0].definitions[0].example;
            const phonetic = wordData.phonetic || wordData.phonetics[1]?.text || "";
            const audioSrc = wordData.phonetics.find(p => p.audio)?.audio;

            result.innerHTML = `
                <div class="word">
                    <h3>${word}</h3>
                    ${audioSrc ? `<button onclick="playSound('${audioSrc}')"><i class="fas fa-volume-up"></i></button>` : ""}
                </div>
                <div class="details">
                    <p>${wordData.meanings[0].partOfSpeech}</p>
                    <p>${phonetic}</p>
                </div>
                <p class="word-meaning">${meaning}</p>
                <p class="word-example">${example}</p>
            `;
        })
        .catch(() => {
            result.innerHTML = `<p class="error">Word not found. Please try another word.</p>`;
        });
};

// Play audio function
function playSound(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

// Event Listeners
btn.addEventListener("click", fetchWord);

inpWord.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWord();
    }
});