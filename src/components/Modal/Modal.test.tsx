import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal Component", () => {
  test("должен отображать сообщение", () => {
    const message = "Тестовое сообщение";
    render(<Modal message={message} onClose={() => {}} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("должен вызывать функцию onClose при клике на кнопку 'Закрыть'", () => {
    const onClose = jest.fn();
    render(<Modal message="Тестовое сообщение" onClose={onClose} />);

    fireEvent.click(screen.getByText("Закрыть"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("должен вызывать функцию onClose при клике на оверлей", () => {
    const onClose = jest.fn();
    render(<Modal message="Тестовое сообщение" onClose={onClose} />);

    fireEvent.click(screen.getByTestId("modal-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("не должен вызывать функцию onClose при клике внутрь модального окна", () => {
    const onClose = jest.fn();
    render(<Modal message="Тестовое сообщение" onClose={onClose} />);

    fireEvent.click(screen.getByTestId("modal-content"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
