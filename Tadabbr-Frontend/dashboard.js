// API Base URL - Update this to match your backend URL
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let quotes = [];
let editingQuoteId = null;

// Theme functionality
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

// Notification system
function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.style.backgroundColor = type === 'error' ? '#e74c3c' : '#27ae60';
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Quote Management Functions
async function loadQuotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/quotes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        quotes = data.quotes || [];
        displayQuotes();
    } catch (error) {
        console.error('Error loading quotes:', error);
        showNotification('حدث خطأ أثناء تحميل الاقتباسات', 'error');
        document.getElementById('quotesTable').innerHTML = '<p>حدث خطأ أثناء تحميل الاقتباسات</p>';
    }
}

function displayQuotes() {
    const quotesTable = document.getElementById('quotesTable');
    
    if (quotes.length === 0) {
        quotesTable.innerHTML = '<p>لا توجد اقتباسات حالياً</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>النص</th>
                    <th>المؤلف</th>
                    <th>المصدر</th>
                    <th>تاريخ الإنشاء</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
    `;

    quotes.forEach(quote => {
        const createdDate = new Date(quote.created_at).toLocaleDateString('ar-SA');
        const source = quote.source && quote.source.Valid ? quote.source.String : '-';
        
        html += `
            <tr>
                <td>
                    <div class="quote-text">${quote.text}</div>
                </td>
                <td>
                    <div class="quote-author">${quote.author}</div>
                </td>
                <td>
                    <div class="quote-source">${source}</div>
                </td>
                <td>${createdDate}</td>
                <td class="actions">
                    <button class="edit" onclick="editQuote(${quote.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="delete" onclick="deleteQuote(${quote.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    quotesTable.innerHTML = html;
}

// Modal Functions
function openAddQuoteModal() {
    editingQuoteId = null;
    document.getElementById('modalTitle').textContent = 'إضافة اقتباس جديد';
    document.getElementById('quoteId').value = '';
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
    document.getElementById('quoteSource').value = '';
    document.getElementById('submitBtn').textContent = 'حفظ';
    document.getElementById('quoteModal').classList.add('show');
}

function openEditQuoteModal(quoteId) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) {
        showNotification('لم يتم العثور على الاقتباس', 'error');
        return;
    }

    editingQuoteId = quoteId;
    document.getElementById('modalTitle').textContent = 'تعديل الاقتباس';
    document.getElementById('quoteId').value = quote.id;
    document.getElementById('quoteText').value = quote.text;
    document.getElementById('quoteAuthor').value = quote.author;
    document.getElementById('quoteSource').value = quote.source && quote.source.Valid ? quote.source.String : '';
    document.getElementById('submitBtn').textContent = 'تحديث';
    document.getElementById('quoteModal').classList.add('show');
}

function closeQuoteModal() {
    document.getElementById('quoteModal').classList.remove('show');
    editingQuoteId = null;
}

// Quote CRUD Operations
async function createQuote(quoteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quoteData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'حدث خطأ أثناء إنشاء الاقتباس');
        }

        showNotification('تم إنشاء الاقتباس بنجاح');
        closeQuoteModal();
        loadQuotes();
    } catch (error) {
        console.error('Error creating quote:', error);
        showNotification(error.message, 'error');
    }
}

async function updateQuote(quoteId, quoteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/quotes/${quoteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quoteData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'حدث خطأ أثناء تحديث الاقتباس');
        }

        showNotification('تم تحديث الاقتباس بنجاح');
        closeQuoteModal();
        loadQuotes();
    } catch (error) {
        console.error('Error updating quote:', error);
        showNotification(error.message, 'error');
    }
}

async function deleteQuote(quoteId) {
    if (!confirm('هل أنت متأكد من حذف هذا الاقتباس؟')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/quotes/${quoteId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'حدث خطأ أثناء حذف الاقتباس');
        }

        showNotification('تم حذف الاقتباس بنجاح');
        loadQuotes();
    } catch (error) {
        console.error('Error deleting quote:', error);
        showNotification(error.message, 'error');
    }
}

// Form submission handler
document.getElementById('quoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const text = document.getElementById('quoteText').value.trim();
    const author = document.getElementById('quoteAuthor').value.trim();
    const source = document.getElementById('quoteSource').value.trim();

    if (!text || !author) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    const quoteData = {
        text: text,
        author: author,
        source: source
    };

    if (editingQuoteId) {
        await updateQuote(editingQuoteId, quoteData);
    } else {
        await createQuote(quoteData);
    }
});

// Edit quote function (called from table)
function editQuote(quoteId) {
    openEditQuoteModal(quoteId);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target === modal) {
        closeQuoteModal();
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-toggle i');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Load quotes
    loadQuotes();
});