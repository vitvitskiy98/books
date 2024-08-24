import { FC } from "react";
import { BookInformation, ReviewInformation } from "./lib/types";

const Card: FC<{ book: BookInformation }> = ({ book }) => {
  return (
    <div>
      <h3>{book.name}</h3>
      <p>
        <b>Автор</b>: {book.author.name}
      </p>
      <p>
        <b>Описание</b>: {book.description}
      </p>
      {book.reviews.length > 0 && (
        <p>
          <b>Отзывы: </b>
          <div className="reviews">
            {book.reviews.map((r) => (
              <div>
                <div>Автор: {r.user.name}</div>
                <div>Текст: {r.text}</div>
              </div>
            ))}
          </div>
        </p>
      )}
    </div>
  );
};

export default Card;
