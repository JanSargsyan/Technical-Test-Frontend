import React from "react";
import ReactDOM from "react-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Fake Node server to mock repsonses from iTunes API
const server = setupServer(
  rest.get("/search?artists", (req, res, ctx) => {
    return res(ctx.json({ data: "JSON OBJECT HERE" }));
  }),
  rest.get("/search?album", (req, res, ctx) => {
    return res(ctx.json({ data: "JSON OBJECT HERE" }));
  }),
  rest.get("/search?song", (req, res, ctx) => {
    return res(ctx.json({ data: "JSON OBJECT HERE" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// IntersectionObserver isn't available in test environment so we need to mock observer
beforeEach(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

test("renders header", () => {
  const initialState = {
    results: [
      {
        wrapperType: "audiobook",
        artistId: 1082626440,
        collectionId: 547405920,
      },
      {
        wrapperType: "audiobook",
        artistId: 1082626440,
        collectionId: 547405920,
      },
    ],
  };
  const mockStore = configureStore();
  let store;
  store = mockStore(initialState);

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/iTunes Search API/i);
  expect(linkElement).toBeInTheDocument();
});

// TODO: Add more tests, set input and check if there are results, check for text if there is no results etc..
