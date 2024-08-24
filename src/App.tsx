import "./styles.css";
import { Book, BookInformation, Review, ReviewInformation, User } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// // В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.

const toBookInformation = (book: Book, author: User | undefined, reviews: ReviewInformation[]): BookInformation => {
  return {
    id: book.id,
    name: book.name || "Книга без названия",
    author: author ?? { id: "not-found", name: "Неизвестный автор" },
    reviews,
    description: book.description
  };
};

const toReviewInformation = (review: Review, user: User): ReviewInformation => {
  return {
    id: review.id,
    user,
    text: review.text
  }
}

const App: FC = () => {
  const [books, setBooks] = useState<BookInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedReviews = await getReviews();
      const users = await getUsers();
      const reviews = fetchedReviews.map(review => {
        return toReviewInformation(review, users.find(
            user => user.id === review.userId
        ) as User)
      });

      const fetchedBooks = await getBooks()
      setBooks(fetchedBooks.map(book => {
        return toBookInformation(
            book,
            users.find(user => user.id === book.authorId),
            book.reviewIds.map(rId => reviews.find(review => review.id === rId)) as ReviewInformation[]
        )
      }));
      setIsLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((b) => <Card
            key={b.id}
            book={b}
        />)}
    </div>
  );
};

export default App;
