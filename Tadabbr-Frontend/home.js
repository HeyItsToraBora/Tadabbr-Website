    
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
        let uniqueWords = [];
        let wordLocations = {};
        let imlaeiData = null;
        let imlaeiLoaded = false;

        
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
                
                const wordSet = new Set();
                for (const wordObj of data) {
                    if (wordObj.text) {
                        wordSet.add(wordObj.text);
                        if (!wordLocations[wordObj.text]) wordLocations[wordObj.text] = [];
                        wordLocations[wordObj.text].push(wordObj.location);
                    }
                }
                uniqueWords = Array.from(wordSet);
                console.log('Unique words loaded:', uniqueWords.length);
            })
            .catch(error => {
                console.error('Error loading words.json:', error);
                showNotification('حدث خطأ أثناء تحميل الكلمات');
            });

       
        function loadImlaei(cb) {
            if (imlaeiLoaded) { cb(); return; }
            fetch('Quran/Imlaei.json')
                .then(response => response.json())
                .then(data => { imlaeiData = data; imlaeiLoaded = true; cb(); });
        }

        
        function levenshtein(a, b) {
            const m = a.length, n = b.length;
            const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
            for (let i = 0; i <= m; i++) dp[i][0] = i;
            for (let j = 0; j <= n; j++) dp[0][j] = j;
            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
                    else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
                }
            }
            return dp[m][n];
        }

       
        function onWordInput() {
            const input = document.getElementById('wordSearch').value.trim();
            const suggBox = document.getElementById('word-suggestions');
            if (!input || uniqueWords.length === 0) { suggBox.style.display = 'none'; return; }
            
            
            const matches = uniqueWords.filter(w => w.includes(input));
            const top = matches.slice(0, 5);
            
            suggBox.innerHTML = top.map(s => `<div class="dropdown-item" onclick="onSuggestionClick('${s.replace(/'/g, '\'')}', event)">${s}</div>`).join('');
            suggBox.classList.add('show');
            suggBox.style.display = 'block';
        }

        
        function onSuggestionClick(word, event) {
            event.stopPropagation();
            document.getElementById('wordSearch').value = word;
            document.getElementById('word-suggestions').style.display = 'none';
            
            const locs = wordLocations[word];
            if (!locs || locs.length === 0) return;
            const firstLoc = locs[0];
            loadImlaei(() => {
                const [surah, verse] = firstLoc.split(':');
                const key = `${surah}:${verse}`;
                const verseObj = imlaeiData[key];
                if (verseObj && verseObj.text) {
                    showVerseResult(surah, verse, verseObj.text);
                }
            });
        }

        
        function searchByWords() {
            const input = document.getElementById('wordSearch').value.trim();
            if (!input) {
                showNotification('الرجاء إدخال كلمة للبحث');
                return;
            }
            if (uniqueWords.length === 0) {
                showNotification('جاري تحميل الكلمات...');
                return;
            }
            
            
            let matches = uniqueWords.filter(w => w === input);
            
            
            if (matches.length === 0) {
                matches = uniqueWords.filter(w => w.includes(input));
            }
            
            if (matches.length === 0) {
                showNotification('لا توجد آيات تحتوي على هذه الكلمة');
                return;
            }
            
            
            const bestWord = matches[0];
            const locs = wordLocations[bestWord];
            
            loadImlaei(() => {
                const resultContainer = document.getElementById('result');
                resultContainer.style.display = 'block';
                resultContainer.innerHTML = `<h3>نتائج البحث عن: <b>${bestWord}</b></h3>`;
                const versesHtml = locs.map(loc => {
                    const [surah, verse] = loc.split(':');
                    const key = `${surah}:${verse}`;
                    const verseObj = imlaeiData[key];
                    if (verseObj && verseObj.text) {
                        
                        const surahNumber = surahs.indexOf(surahs[parseInt(surah)-1]) + 1;

                        return `
                            <a href="aya.html?surah=${surahNumber}&verse=${verse}" style="text-decoration: none; color: inherit; cursor: pointer;">
                            <div class="verse-container">
                                <div class="verse-info">
                                    <p>سورة ${surahs[parseInt(surah)-1]}</p>
                                    <span class="verse-number">آية ${verse}</span>
                                </div>
                                <div class="verse-text">${verseObj.text}</div>
                            </div>
                            </a>
                        `;
                    }
                    return '';
                }).join('');
                resultContainer.innerHTML += versesHtml;
            });
        }

        
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