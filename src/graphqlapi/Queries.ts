import { gql } from '@apollo/client';

const GET_TODOS = gql`
    {
        todos {
            todoID
            task
            category
        }
    }
`;

export {
    GET_TODOS
};