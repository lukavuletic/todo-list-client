import React, { FormEvent, useState } from 'react';
import { useMutation } from '@apollo/client';

import { ITodo } from 'interfaces/todo';

import { CREATE_TODO } from 'graphqlapi';

interface Props {
    state: {
        categories: ITodo['category'][],
        selectedCategories: ITodo['category'][],
        todos: ITodo[],
    };
    actions: {
        setStateTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
        setStateSelectedCategories: React.Dispatch<React.SetStateAction<ITodo['category'][]>>
    }
}

export const TodoCreate: React.FC<Props> = ({
    state: {
        categories,
        selectedCategories,
        todos,
    },
    actions: {
        setStateTodos,
        setStateSelectedCategories,
    },
}) => {
    const [taskInputValue, setStateTaskInputValue] = useState<ITodo["task"]>('');
    const [categoryInputValue, setStateCategoryInputValue] = useState<ITodo["category"]>('');

    const onTaskInputChange = (value: ITodo["task"]): void => {
        setStateTaskInputValue(value);
    }

    const onCategoryInputChange = (value: ITodo["category"]): void => {
        setStateCategoryInputValue(value);
    }

    const [createTodo, { error }] = useMutation(CREATE_TODO);

    const addTodo = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const createdItem = await createTodo({
            variables: {
                task: taskInputValue,
                category: categoryInputValue
            }
        });

        if (error) {
            alert(error);
        } else {
            setStateTodos([...todos, createdItem.data.createTodo]);
            // if label is newly created, select it by defualt
            if (!categories.includes(categoryInputValue)) {
                setStateSelectedCategories([...selectedCategories, categoryInputValue]);
            }
            setStateTaskInputValue('');
            setStateCategoryInputValue('');
        }
    }

    return (
        <form onSubmit={addTodo}>
            <div className="inputField">
                <label htmlFor="task">Task name: </label>
                <input id="task" type="text" name="task" value={taskInputValue} onChange={(e: { target: HTMLInputElement }) => onTaskInputChange(e.target.value)} />
            </div>
            <div className="inputField">
                <label htmlFor="category">Category name: </label>
                <input id="category" type="text" name="category" value={categoryInputValue} onChange={(e: { target: HTMLInputElement }) => onCategoryInputChange(e.target.value)} />
            </div>
            <button type="submit">OK</button>
        </form>
    )
}