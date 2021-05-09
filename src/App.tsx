import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, } from "@apollo/client";
import { ErrorResponse, onError } from "@apollo/client/link/error";

import './App.css';

import { TodoPage } from 'modules/todo/pages';

const errorLink = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      alert(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) {
    alert(`[Network error]: ${networkError}`);
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://api:4000/api" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="container" >
        <TodoPage />
      </div>
    </ApolloProvider>
  );
}

export default App;