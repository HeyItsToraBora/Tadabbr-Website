
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

       let imlaeiData = null;

       document.addEventListener('DOMContentLoaded', () => {
           loadImlaei(() => {
               populateSurahDropdown();
               displayVerseFromUrl();
           });

           const savedTheme = localStorage.getItem('theme');
           const themeIcon = document.querySelector('.theme-toggle i');
           if (savedTheme === 'dark') {
               document.body.setAttribute('data-theme', 'dark');
               themeIcon.classList.remove('fa-moon');
               themeIcon.classList.add('fa-sun');
           }
       });

       function loadImlaei(cb) {
           if (imlaeiData) { cb(); return; }
           fetch('Quran/Imlaei.json')
               .then(response => response.json())
               .then(data => {
                   imlaeiData = data;
                   cb();
               })
               .catch(error => {
                   console.error('Error fetching Imlaei.json:', error);
                   document.getElementById('verseDisplay').innerHTML = '<div class="verse-item verse-info">حدث خطأ أثناء تحميل بيانات القرآن.</div>';
                    document.getElementById('poeticEvidencesContent').innerHTML = '<p>حدث خطأ أثناء تحميل الشواهد الشعرية.</p>';
               });
       }

       function getUrlParams() {
           const params = {};
           const queryString = window.location.search;
           const urlParams = new URLSearchParams(queryString);
           for (const [key, value] of urlParams) {
               params[key] = value;
           }
           return params;
       }

       function displayVerseFromUrl() {
           const params = getUrlParams();
           const surahNum = parseInt(params.surah);
           const verseNum = parseInt(params.verse);

           if (!imlaeiData || isNaN(surahNum) || isNaN(verseNum) || surahNum < 1 || surahNum > surahs.length || verseNum < 1 || verseNum > surahVerses[surahs[surahNum - 1]]) {
                document.getElementById('verseDisplay').innerHTML = '<div class="verse-item verse-info">الرجاء تحديد سورة ورقم آية صحيحين في الرابط.</div>';
                document.getElementById('poeticEvidencesContent').innerHTML = '<p>لا تتوفر شواهد شعرية.</p>';
                return;
           }

           displayVerse(surahNum, verseNum);
           selectDropdowns(surahNum, verseNum);
       }

       function displayVerse(surahNum, verseNum) {
           const verseKey = `${surahNum}:${verseNum}`;
           const verseObj = imlaeiData[verseKey];
           const verseDisplayDiv = document.getElementById('verseDisplay');
           verseDisplayDiv.innerHTML = '';

           if (!verseObj) {
                verseDisplayDiv.innerHTML = '<div class="verse-item verse-info">لم يتم العثور على الآية المطلوبة.</div>';
                document.getElementById('poeticEvidencesContent').innerHTML = '<p>لا تتوفر شواهد شعرية.</p>';
                return;
           }

           
           const numVersesInSurah = surahVerses[surahs[surahNum - 1]];
           const versesToShow = 5;

           let startVerse = Math.max(1, verseNum - 2);
           let endVerse = Math.min(numVersesInSurah, verseNum + 2);

           
           const currentDisplayed = endVerse - startVerse + 1;
           if (currentDisplayed < versesToShow) {
               const needed = versesToShow - currentDisplayed;
               if (startVerse === 1) {
                   
                   endVerse = Math.min(numVersesInSurah, endVerse + needed);
               } else if (endVerse === numVersesInSurah) {
                   
                   startVerse = Math.max(1, startVerse - needed);
               }
               
           }

           
           const surahNameDiv = document.createElement('div');
           surahNameDiv.className = 'verse-info';
           surahNameDiv.style.marginBottom = '10px';
           surahNameDiv.textContent = `سورة ${surahs[surahNum - 1]}`;
           verseDisplayDiv.appendChild(surahNameDiv);

           let versesHtmlContent = '';

           for (let i = startVerse; i <= endVerse; i++) {
               const currentVerseKey = `${surahNum}:${i}`;
               const currentVerseObj = imlaeiData[currentVerseKey];
               if (currentVerseObj) {
                   const isHighlighted = (i === verseNum);
                   const verseTextClass = `verse-text${isHighlighted ? ' highlighted' : ''}`;

                   
                   
                   versesHtmlContent += `<span class="verse-block-span" data-surah="${surahNum}" data-verse="${i}" style="cursor: ${(i !== verseNum) ? 'pointer' : 'default'};">`;
                   versesHtmlContent += `<span class="${verseTextClass}">${currentVerseObj.text}</span>`;
                   versesHtmlContent += `<span class="verse-number">(${i})</span>`;
                   versesHtmlContent += `</span>`;
               }
           }

           
           verseDisplayDiv.innerHTML += versesHtmlContent;

           
           verseDisplayDiv.onclick = (event) => {
               const clickedElement = event.target;
               const verseBlockSpan = clickedElement.closest('.verse-block-span');
               if (verseBlockSpan && verseBlockSpan.dataset.surah && verseBlockSpan.dataset.verse) {
                   const clickedSurah = parseInt(verseBlockSpan.dataset.surah);
                   const clickedVerse = parseInt(verseBlockSpan.dataset.verse);
                   
                   if (clickedSurah !== surahNum || clickedVerse !== verseNum) {
                        window.location.href = `aya.html?surah=${clickedSurah}&verse=${clickedVerse}`;
                   }
               }
           };

           loadPoeticEvidences(surahNum, verseNum);
       }

        function populateSurahDropdown() {
           const surahDropdown = document.getElementById('surahDropdown');
           surahDropdown.innerHTML = '<option value="">اختر السورة</option>';
           surahs.forEach((surah, index) => {
               const option = document.createElement('option');
               option.value = index + 1;
               option.textContent = surah;
               surahDropdown.appendChild(option);
           });

           surahDropdown.addEventListener('change', handleSurahChange);
       }

       function handleSurahChange() {
           const surahDropdown = document.getElementById('surahDropdown');
           const verseDropdown = document.getElementById('verseDropdown');
           const selectedSurahNum = parseInt(surahDropdown.value);

           verseDropdown.innerHTML = '<option value="">اختر الآية</option>';
           if (!isNaN(selectedSurahNum) && selectedSurahNum > 0) {
               const surahName = surahs[selectedSurahNum - 1];
               const numVerses = surahVerses[surahName];
               for (let i = 1; i <= numVerses; i++) {
                   const option = document.createElement('option');
                   option.value = i;
                   option.textContent = `آية ${i}`;
                   verseDropdown.appendChild(option);
               }
           }
            verseDropdown.addEventListener('change', handleVerseChange);
       }

        function handleVerseChange() {
            const surahDropdown = document.getElementById('surahDropdown');
           const verseDropdown = document.getElementById('verseDropdown');
            const selectedSurahNum = parseInt(surahDropdown.value);
           const selectedVerseNum = parseInt(verseDropdown.value);

            if (!isNaN(selectedSurahNum) && !isNaN(selectedVerseNum) && selectedSurahNum > 0 && selectedVerseNum > 0) {
                
                window.location.href = `aya.html?surah=${selectedSurahNum}&verse=${selectedVerseNum}`;
            }
        }

       function selectDropdowns(surahNum, verseNum) {
            const surahDropdown = document.getElementById('surahDropdown');
             const verseDropdown = document.getElementById('verseDropdown');

             surahDropdown.value = surahNum;
             handleSurahChange();
             verseDropdown.value = verseNum;
         }


       function loadPoeticEvidences(surahNum, verseNum) {
           const poeticEvidencesContentDiv = document.getElementById('poeticEvidencesContent');
           const verseKey = `${surahNum}:${verseNum}`;

           
           fetch('Quran/شواهد.json')
               .then(response => response.json())
               .then(data => {
                   
                   const verseEvidences = data.responses.filter(evidence => evidence.VerseKey === verseKey);

                   if (verseEvidences.length > 0) {
                       let htmlContent = '<div class="poetic-evidence-list">';
                       verseEvidences.forEach(evidence => {
                           htmlContent += `
                               <div class="poetic-evidence-item">
                                   <div class="poet-name">${evidence.Poet}</div>
                                   ${evidence.ContextBefore ? `<div class="context-before">${evidence.ContextBefore}</div>` : ''}
                                   <div class="poetry-text">${evidence.Poetry}</div>
                                   ${evidence.ContextAfter ? `<div class="context-after">${evidence.ContextAfter}</div>` : ''}
                                   <div class="tafsir-source">${evidence.Tafsir}</div>
                               </div>
                           `;
                       });
                       htmlContent += '</div>';
                       poeticEvidencesContentDiv.innerHTML = htmlContent;
                   } else {
                       poeticEvidencesContentDiv.innerHTML = '<p>لا تتوفر شواهد شعرية لهذه الآية حاليًا.</p>';
                   }
               })
               .catch(error => {
                   console.error('Error fetching poetic evidences:', error);
                   poeticEvidencesContentDiv.innerHTML = '<p>حدث خطأ أثناء تحميل الشواهد الشعرية.</p>';
               });
       }

       function toggleTheme() {
           const body = document.body;
           const currentTheme = body.getAttribute('data-theme');
           const themeIcon = document.querySelector('.theme-toggle i');
           const themeBtn = document.querySelector('.theme-toggle');
           themeBtn.classList.add('animated');
           
           void themeBtn.offsetHeight;
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

       function reportError() {
           const params = getUrlParams();
           const surahNum = parseInt(params.surah);
           const verseNum = parseInt(params.verse);
           
           openModal();
       }

       function openModal() {
           const modal = document.getElementById('reportModal');
           modal.classList.add('show');
           populatePoeticEvidenceSelect();
       }

       function closeModal() {
           const modal = document.getElementById('reportModal');
           modal.classList.remove('show');
       }

       function populatePoeticEvidenceSelect() {
           const selectElement = document.getElementById('poeticEvidenceSelect');
           selectElement.innerHTML = '';
           const poeticEvidencesContentDiv = document.getElementById('poeticEvidencesContent');
           const evidenceItems = poeticEvidencesContentDiv.querySelectorAll('.poetic-evidence-item');

           if (evidenceItems.length === 0) {
               const option = document.createElement('option');
               option.value = '';
               option.textContent = 'لا توجد شواهد شعرية متاحة';
               selectElement.appendChild(option);
               selectElement.disabled = true;
           } else {
               selectElement.disabled = false;
               evidenceItems.forEach((item, index) => {
                   const option = document.createElement('option');
                   
                   option.value = index;
                   
                   const poetName = item.querySelector('.poet-name')?.textContent || 'شاهد غير معروف';
                   option.textContent = `شاهد شعري من ${poetName} (رقم ${index + 1})`;
                   selectElement.appendChild(option);
               });
           }
       }

       function submitReport() {
           const selectedEvidenceIndex = document.getElementById('poeticEvidenceSelect').value;
           const comment = document.getElementById('reportComment').value.trim();

           if (!comment) {
               showNotification('لا يمكن أن يكون التعليق فارغ');
               return;
           }

           
           
           const poeticEvidencesContentDiv = document.getElementById('poeticEvidencesContent');
           const evidenceItems = poeticEvidencesContentDiv.querySelectorAll('.poetic-evidence-item');
           const selectedEvidence = evidenceItems[parseInt(selectedEvidenceIndex)];
           const poetName = selectedEvidence.querySelector('.poet-name')?.textContent || 'شاهد غير معروف';
           const poetryText = selectedEvidence.querySelector('.poetry-text')?.textContent || 'نص غير متوفر';

           console.log('Report Submitted:');
           console.log('Verse Key:', `${getUrlParams().surah}:${getUrlParams().verse}`);
           console.log('Selected Poetic Evidence:', { poet: poetName, poetry: poetryText });
           console.log('Comment:', comment);

           
           closeModal();
           showNotification('تم إرسال البلاغ بنجاح. شكراً لك!');
       }

       function showNotification(message) {
           const notif = document.getElementById('notification');
           notif.textContent = message;
           notif.classList.add('show');
           setTimeout(() => notif.classList.remove('show'), 2500);
       }

       
       window.onclick = function(event) {
           const modal = document.getElementById('reportModal');
           if (event.target == modal) {
               closeModal();
           }
       }

