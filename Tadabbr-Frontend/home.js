    
        const surahs = [
            "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"
        ];

        
        const surahVerses = {
            "الفاتحة": 7, "البقرة": 286, "آل عمران": 200, "النساء": 176, "المائدة": 120,
            "الأنعام": 165, "الأعراف": 206, "الأنفال": 75, "التوبة": 129, "يونس": 109,
            "هود": 123, "يوسف": 111, "الرعد": 43, "إبراهيم": 52, "الحجر": 99,
            "النحل": 128, "الإسراء": 111, "الكهف": 110, "مريم": 98, "طه": 135,
            "الأنبياء": 112, "الحج": 78, "المؤمنون": 118, "النور": 64, "الفرقان": 77,
            "الشعراء": 227, "النمل": 93, "القصص": 88, "العنكبوت": 69, "الروم": 60,
            "لقمان": 34, "السجدة": 30, "الأحزاب": 73, "سبأ": 54, "فاطر": 45,
            "يس": 83, "الصافات": 182, "ص": 88, "الزمر": 75, "غافر": 85,
            "فصلت": 54, "الشورى": 53, "الزخرف": 89, "الدخان": 59, "الجاثية": 37,
            "الأحقاف": 35, "محمد": 38, "الفتح": 29, "الحجرات": 18, "ق": 45,
            "الذاريات": 60, "الطور": 49, "النجم": 62, "القمر": 55, "الرحمن": 78,
            "الواقعة": 96, "الحديد": 29, "المجادلة": 22, "الحشر": 24, "الممتحنة": 13,
            "الصف": 14, "الجمعة": 11, "المنافقون": 11, "التغابن": 18, "الطلاق": 12,
            "التحريم": 12, "الملك": 30, "القلم": 52, "الحاقة": 52, "المعارج": 44,
            "نوح": 28, "الجن": 28, "المزمل": 20, "المدثر": 56, "القيامة": 40,
            "الإنسان": 31, "المرسلات": 50, "النبأ": 40, "النازعات": 46, "عبس": 42,
            "التكوير": 29, "الانفطار": 19, "المطففين": 36, "الانشقاق": 25, "البروج": 22,
            "الطارق": 17, "الأعلى": 19, "الغاشية": 26, "الفجر": 30, "البلد": 20,
            "الشمس": 15, "الليل": 21, "الضحى": 11, "الشرح": 8, "التين": 8,
            "العلق": 19, "القدر": 5, "البينة": 8, "الزلزلة": 8, "العاديات": 11,
            "القارعة": 11, "التكاثر": 8, "العصر": 3, "الهمزة": 9, "الفيل": 5,
            "قريش": 4, "الماعون": 7, "الكوثر": 3, "الكافرون": 6, "النصر": 3,
            "المسد": 5, "الإخلاص": 4, "الفلق": 5, "الناس": 6
        };

        
        let selectedSurah = "";

        
        function populateDropdown(filter = "") {
            const list = document.getElementById('dropdownList');
            list.innerHTML = "";
            let found = false;
            surahs.forEach(surah => {
                if (surah.includes(filter)) {
                    found = true;
                    const div = document.createElement('div');
                    div.className = 'dropdown-item';
                    div.textContent = surah;
                    div.onclick = () => selectSurah(surah);
                    list.appendChild(div);
                }
            });
            if (!found) {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.textContent = 'لا توجد نتائج';
                div.style.color = '#aaa';
                div.style.cursor = 'default';
                list.appendChild(div);
            }
        }

        function showDropdown() {
            const list = document.getElementById('dropdownList');
            list.classList.add('show');
            populateDropdown();
        }

        function hideDropdown() {
            setTimeout(() => {
                document.getElementById('dropdownList').classList.remove('show');
            }, 150);
        }

        function filterDropdown() {
            const val = document.getElementById('dropdownInput').value;
            populateDropdown(val);
        }

        function selectSurah(surah) {
            document.getElementById('dropdownInput').value = surah;
            selectedSurah = surah;
            
            const verseInput = document.getElementById('verse');
            verseInput.max = surahVerses[surah];
            verseInput.placeholder = `رقم الآية (1-${surahVerses[surah]})`;
            verseInput.disabled = false;
            hideDropdown();
        }

        
        document.getElementById('dropdownInput').removeAttribute('readonly');
        document.getElementById('dropdownInput').addEventListener('blur', hideDropdown);
        document.getElementById('dropdownInput').addEventListener('focus', showDropdown);
        document.getElementById('dropdownInput').addEventListener('input', filterDropdown);

        
        const verseInput = document.getElementById('verse');
        verseInput.disabled = true;

        
        verseInput.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (value < 0) {
                e.target.value = 0;
                showNotification('لا يمكن أن يكون رقم الآية سالبًا');
            }
            if (selectedSurah && value > surahVerses[selectedSurah]) {
                e.target.value = surahVerses[selectedSurah];
                showNotification('لقد تجاوزت عدد آيات السورة');
            }
        });

        
        function searchVerse() {
            const surah = document.getElementById('dropdownInput').value;
            const verse = document.getElementById('verse').value;
            
            if (!surah || !verse) {
                showNotification('الرجاء إدخال اسم السورة ورقم الآية');
                return;
            }

            const verseNum = parseInt(verse);
            if (verseNum < 1 || verseNum > surahVerses[surah]) {
                showNotification(`رقم الآية يجب أن يكون بين 1 و ${surahVerses[surah]}`);
                return;
            }

            
            const surahNumber = surahs.indexOf(surah) + 1;
            if (surahNumber === 0) {
                showNotification('اسم السورة غير صحيح');
                return;
            }

            
            window.location.href = `aya.html?surah=${surahNumber}&verse=${verseNum}`;
        }

        let wordsData = null;
        // Old variables removed - now using API-based search

        
        fetch('Quran/words.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Words data loaded:', data.length, 'items');
                wordsData = data;
            })
            .catch(error => {
                console.error('Error loading words.json:', error);
                showNotification('حدث خطأ أثناء تحميل الكلمات');
            });

       
        // Old loadImlaei function removed - now using API-based search

        
        // Old levenshtein function removed - now using API-based search

       
        // Old onWordInput and onSuggestionClick functions removed - now using API-based search

        
        // Old searchByWords function removed - now using API-based search

        
        function showVerseResult(surah, verse, text) {
            const poetryBtnContainer = document.getElementById('poetry-btn-container');
            poetryBtnContainer.innerHTML = `
                <button id="poetry-btn" class="poetry-btn">الشواهد الشعرية للآية</button>
            `;
            poetryBtnContainer.style.display = 'block';
            const resultContainer = document.getElementById('result');
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <div class="verse-container">
                    <div class="verse-info">
                        <p>سورة ${surahs[parseInt(surah)-1]}</p>
                        <span class="verse-number">آية ${verse}</span>
                    </div>
                    <div class="verse-text">${text}</div>
                </div>
            `;
        }

        
        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const themeIcon = document.querySelector('.theme-toggle i');
            const themeBtn = document.querySelector('.theme-toggle');
            themeBtn.classList.add('animated');
            setTimeout(() => themeBtn.classList.remove('animated'), 600);
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }

        
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            const themeIcon = document.querySelector('.theme-toggle i');
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });

        
        function showNotification(message) {
            const notif = document.getElementById('notification');
            notif.textContent = message;
            notif.classList.add('show');
            setTimeout(() => notif.classList.remove('show'), 2500);
        }

// API Base URL for quotes
const API_BASE_URL = 'http://localhost:8080';
let allQuotes = [];
let currentQuoteIndex = 0;

// --- QUOTES FUNCTIONALITY ---
async function loadAllQuotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotes`);
        if (!response.ok) throw new Error('Failed to fetch quotes');
        const data = await response.json();
        allQuotes = data.quotes || [];
        if (allQuotes.length > 0) {
            loadRandomQuote();
        } else {
            showNoQuotes();
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
        showNoQuotes();
    }
}

function loadRandomQuote() {
    if (allQuotes.length === 0) {
        showNoQuotes();
        return;
    }
    
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    const quote = allQuotes[randomIndex];
    displayQuote(quote);
}

function displayQuote(quote) {
    const quotesBox = document.getElementById('quotesBox');
    if (!quotesBox) return;
    
    const source = quote.source && quote.source.Valid ? quote.source.String : '';
    const sourceHtml = source ? `<div class="quote-source">المصدر: ${source}</div>` : '';
    
    quotesBox.innerHTML = `
        <div class="quote-content">
            <div class="quote-text">"${quote.text}"</div>
            <div class="quote-author">- ${quote.author}</div>
            ${sourceHtml}
        </div>
    `;
}

function showNoQuotes() {
    const quotesBox = document.getElementById('quotesBox');
    if (!quotesBox) return;
    
    quotesBox.innerHTML = `
        <div class="no-quotes">
            <p>لا توجد اقتباسات متاحة حالياً</p>
        </div>
    `;
}

// Load quotes when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadAllQuotes();
});

// Make loadRandomQuote available globally for the reload button
window.loadRandomQuote = loadRandomQuote;

// --- SUGGESTION API LOGIC ---
const suggestionResultsDiv = document.createElement('div');
suggestionResultsDiv.id = 'suggestionResults';
suggestionResultsDiv.style.cssText = `
    max-width: 600px;
    margin: 1rem auto;
    background: var(--background-color);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: none;
`;

// Insert suggestion results div after quotes section
window.addEventListener('DOMContentLoaded', () => {
    const quotesSection = document.querySelector('.quotes-section');
    if (quotesSection) {
        quotesSection.parentNode.insertBefore(suggestionResultsDiv, quotesSection);
    }
});

async function fetchSuggestions(query, type) {
    try {
        const response = await fetch('http://localhost:8080/sugg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, type })
        });
        
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        return data.suggestions || [];
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    if (!suggestions || suggestions.length === 0) {
        suggestionResultsDiv.innerHTML = '<p>لا توجد نتائج</p>';
        suggestionResultsDiv.style.display = 'block';
        return;
    }
    
    // Sort by match value (lower is better)
    suggestions.sort((a, b) => a.match - b.match);
    
    let html = '<h3>النتائج:</h3><div class="suggestion-list">';
    suggestions.forEach(suggestion => {
        html += `
            <div class="suggestion-item" onclick="goToAya('${suggestion.surahkey}')">
                <div class="suggestion-text">${suggestion.text}</div>
                <div class="suggestion-info">
                    <span class="suggestion-poet">${suggestion.poet || 'شاعر غير معروف'}</span>
                    <span class="suggestion-match">مطابقة: ${suggestion.match}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    suggestionResultsDiv.innerHTML = html;
    suggestionResultsDiv.style.display = 'block';
}

window.goToAya = function(surahkey) {
    const [surah, verse] = surahkey.split(':');
    window.location.href = `aya.html?surah=${surah}&verse=${verse}`;
};

function searchByPoet() {
    const query = document.getElementById('wordSearch').value.trim();
    if (!query) {
        showNotification('الرجاء إدخال نص للبحث');
        return;
    }
    
    fetchSuggestions(query, 'poet').then(suggestions => {
        displaySuggestions(suggestions);
    });
}

function searchByAyat() {
    const query = document.getElementById('wordSearch').value.trim();
    if (!query) {
        showNotification('الرجاء إدخال نص للبحث');
        return;
    }
    
    fetchSuggestions(query, 'ayat').then(suggestions => {
        displaySuggestions(suggestions);
    });
}

// Update the existing functions to use the new API
window.searchInPoetry = searchByPoet;
window.searchByWords = searchByAyat;