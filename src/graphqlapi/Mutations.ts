import { gql } from '@apollo/client';

const CREATE_TODO = gql`
    mutation createTodo($task: String!, $category: String!) {
        createTodo(task: $task, category: $category) {
            todoID
            task
            category
        }
    }
`;

const DELETE_TODO = gql`
    mutation deleteTodo($id: ID!) {
        deleteTodo(id: $id)
    }
`;

const UPDATE_TODO = gql`
    mutation updateTodo($id: ID!, $task: String!, $category: String!) {
        updateTodo(id: $id, task: $task, category: $category) {
            todoID
            task
            category
        }
    }
`;

export {
    CREATE_TODO,
    DELETE_TODO,
    UPDATE_TODO,
};