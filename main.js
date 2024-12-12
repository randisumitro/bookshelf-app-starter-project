// Do your work here...
console.log("Hello, world!");
// Ambil elemen form dan input dari HTML
const bookForm = document.getElementById("bookForm");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// Fungsi untuk membuat ID unik menggunakan timestamp
function generateBookId() {
  return new Date().getTime(); // ID berdasarkan timestamp
}

// Fungsi untuk menambahkan buku ke localStorage
function addBookToLocalStorage(book) {
  let books = JSON.parse(localStorage.getItem("books")) || []; // Ambil data buku yang ada
  books.push(book); // Tambahkan buku baru
  localStorage.setItem("books", JSON.stringify(books)); // Simpan kembali ke localStorage
  renderBooks(); // Render ulang daftar buku
}

// Fungsi untuk merender buku di rak
function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  let books = JSON.parse(localStorage.getItem("books")) || [];

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Tambahkan buku ke rak sesuai status selesai dibaca
    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

// Fungsi untuk menangani pengiriman form dan menambahkan buku
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Ambil nilai dari form
  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = parseInt(bookFormYear.value, 10);
  const isComplete = bookFormIsComplete.checked;

  // Buat objek buku baru
  const newBook = {
    id: generateBookId(),
    title,
    author,
    year,
    isComplete,
  };

  // Tambahkan buku ke localStorage
  addBookToLocalStorage(newBook);

  // Reset form setelah menambahkan
  bookForm.reset();
});

// Panggil renderBooks saat halaman dimuat
window.addEventListener("load", renderBooks);

// Menambahkan event listener untuk tombol "Selesai dibaca"
function moveBookComplete(event) {
  const bookItem = event.target.closest("[data-bookid]");
  const bookId = bookItem.getAttribute("data-bookid");

  let books = JSON.parse(localStorage.getItem("books")) || [];
  let book = books.find((book) => book.id == bookId);

  if (book) {
    book.isComplete = !book.isComplete; // Ubah status isComplete
    localStorage.setItem("books", JSON.stringify(books)); // Simpan perubahan ke localStorage
    renderBooks(); // Render ulang daftar buku
  }
}

// Menambahkan event listener untuk tombol "Selesai dibaca"
document.body.addEventListener("click", function (event) {
  if (event.target.dataset.testid === "bookItemIsCompleteButton") {
    moveBookComplete(event);
  }
});

// Fungsi untuk menghapus buku
function deleteBook(event) {
  const bookItem = event.target.closest("[data-bookid]");
  const bookId = bookItem.getAttribute("data-bookid");

  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.id != bookId); // Hapus buku berdasarkan ID
  localStorage.setItem("books", JSON.stringify(books)); // Simpan perubahan ke localStorage
  renderBooks(); // Render ulang daftar buku
}

// Menambahkan event listener untuk tombol "Hapus Buku"
document.body.addEventListener("click", function (event) {
  if (event.target.dataset.testid === "bookItemDeleteButton") {
    deleteBook(event);
  }
});

// Menambahkan event listener untuk tombol "Edit Buku"
function editBook(event) {
  const bookItem = event.target.closest("[data-bookid]");
  const bookId = bookItem.getAttribute("data-bookid");

  let books = JSON.parse(localStorage.getItem("books")) || [];
  const bookToEdit = books.find((book) => book.id == bookId);

  if (bookToEdit) {
    // Mengisi form dengan data buku yang dipilih
    bookFormTitle.value = bookToEdit.title;
    bookFormAuthor.value = bookToEdit.author;
    bookFormYear.value = bookToEdit.year;
    bookFormIsComplete.checked = bookToEdit.isComplete;

    // Menyembunyikan tombol tambah buku dan mengganti dengan tombol simpan
    const submitButton = document.getElementById("bookFormSubmit");
    submitButton.textContent = "Simpan Perubahan";

    // Menambahkan fungsi untuk menyimpan perubahan buku
    bookForm.addEventListener("submit", function saveBookChanges(event) {
      event.preventDefault();

      bookToEdit.title = bookFormTitle.value;
      bookToEdit.author = bookFormAuthor.value;
      bookToEdit.year = parseInt(bookFormYear.value, 10);
      bookToEdit.isComplete = bookFormIsComplete.checked;

      // Menyimpan kembali buku yang sudah diubah ke localStorage
      localStorage.setItem("books", JSON.stringify(books));

      // Reset form dan kembali ke status semula
      bookForm.reset();
      submitButton.textContent = "Masukkan Buku ke rak Belum selesai dibaca";
      renderBooks();
    });
  }
}

// Menambahkan event listener untuk tombol "Edit Buku"
document.body.addEventListener("click", function (event) {
  if (event.target.dataset.testid === "bookItemEditButton") {
    editBook(event);
  }
});

// Menambahkan event listener untuk pencarian buku
const searchBookForm = document.getElementById("searchBook");
const searchBookTitleInput = document.getElementById("searchBookTitle");

searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchQuery = searchBookTitleInput.value.toLowerCase();

  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Menyaring buku berdasarkan judul yang mengandung kata kunci pencarian
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  // Render buku hasil pencarian
  renderFilteredBooks(filteredBooks);
});

// Fungsi untuk merender buku hasil pencarian
function renderFilteredBooks(filteredBooks) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Tambahkan buku ke rak sesuai status selesai dibaca
    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

// Menambahkan event listener untuk tombol "Hapus Buku"
function deleteBook(event) {
  const bookItem = event.target.closest("[data-bookid]");
  const bookId = bookItem.getAttribute("data-bookid");

  let books = JSON.parse(localStorage.getItem("books")) || [];
  // Menghapus buku berdasarkan ID
  books = books.filter((book) => book.id != bookId);

  // Menyimpan kembali daftar buku ke localStorage
  localStorage.setItem("books", JSON.stringify(books));

  // Menghapus buku dari tampilan
  bookItem.remove();
}

// Menambahkan event listener untuk tombol "Hapus Buku"
document.body.addEventListener("click", function (event) {
  if (event.target.dataset.testid === "bookItemDeleteButton") {
    deleteBook(event);
  }
});

// Fungsi untuk merender buku dari localStorage
// Fungsi untuk merender buku dari localStorage
function renderBooks() {
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Menghapus semua buku yang ada di rak sebelum menambahkan buku baru
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  // Memasukkan buku yang sudah ada ke dalam rak sesuai status isComplete
  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Menambahkan buku ke rak sesuai status isComplete
    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

// Memanggil fungsi untuk merender buku saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", renderBooks);

// Panggil fungsi untuk merender buku saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", renderBooks);

// Menambahkan event listener untuk formulir buku
// Menambahkan event listener untuk formulir buku
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = bookFormTitle.value.trim();
  const author = bookFormAuthor.value.trim();
  const year = parseInt(bookFormYear.value, 10);

  if (!title || !author || isNaN(year)) {
    alert("Pastikan semua form diisi dengan benar.");
    return;
  }

  // Membuat ID buku baru dengan timestamp
  const bookId = new Date().getTime();

  const newBook = {
    id: bookId,
    title: title,
    author: author,
    year: year,
    isComplete: bookFormIsComplete.checked,
  };

  // Menyimpan buku ke localStorage
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));

  // Reset form setelah menyimpan
  bookForm.reset();
  renderBooks(); // Menampilkan buku yang sudah ada, termasuk buku yang baru ditambahkan
});
