import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useForm from './useForm';

const TestHook = ({ callback }) => {
    callback();
    return null;
};

const testHook = (callback) => {
    mount(<TestHook callback={callback} />);
};

describe('useForm hook', () => {
    let form;
    const handleSuccess = jest.fn();
    const validate = jest.fn(() => ({}));
    let initialValues = undefined;
    beforeEach(() => {
        testHook(() => {
            form = useForm({ handleSuccess, validate, initialValues });
        });
    });

    it('should return handleChange, handleBlur, errors, values', () => {
        expect(form).toHaveProperty('handleChange');
        expect(typeof form.handleChange).toBe('function');
        expect(form).toHaveProperty('handleBlur');
        expect(typeof form.handleBlur).toBe('function');
        expect(form).toHaveProperty('errors');
        expect(typeof form.errors).toBe('object');
        expect(form).toHaveProperty('values');
        expect(typeof form.values).toBe('object');
        expect(form).toHaveProperty('touched');
        expect(typeof form.touched).toBe('object');
    });

    it('sets the values state when changing an input value', () => {
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        act(() => {
            form.handleChange(event);
        });

        expect(form.values.foo).toBe('foo-value');
    });

    it('sets the touched state when bluring from an input value', () => {
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        act(() => {
            form.handleBlur(event);
        });

        expect(form.touched.foo).toBe(true);
    });

    it('sets the error state using the validation callback on blur', () => {
        const validateFtn = jest.fn(input => (
            Object.keys(input)
                .reduce((cum, cur) => {
                    const ret = { ...cum, [cur]: true };
                    return ret;
                }, {})));
        testHook(() => {
            form = useForm({ handleSuccess, validate: validateFtn, initialValues });
        });
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        act(() => {
            form.handleBlur(event);
        });
        expect(validateFtn).toHaveBeenCalledTimes(1);
        expect(form.errors).toEqual({ foo: true });
    });

    it('sets the error state using the validation callback on change', () => {
        jest.resetAllMocks();
        const validateFtn = jest.fn(input => (
            Object.keys(input)
                .reduce((cum, cur) => {
                    const ret = { ...cum, [cur]: true };
                    return ret;
                }, {})));
        testHook(() => {
            form = useForm({ handleSuccess, validate: validateFtn, initialValues });
        });
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        act(() => {
            form.handleChange(event);
        });

        expect(form.errors).toEqual({ foo: true });
    });

    it('doesn\'t call handleSuccess when there is an update and errors has properties', () => {
        jest.resetAllMocks();
        const validateFtn = jest.fn(input => (
            Object.keys(input)
                .reduce((cum, cur) => {
                    const ret = { ...cum, [cur]: true };
                    return ret;
                }, {})));
        testHook(() => {
            form = useForm({ handleSuccess, validate: validateFtn, initialValues });
        });
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        act(() => {
            form.handleChange(event);
        });

        expect(handleSuccess).toHaveBeenCalledTimes(1);
        expect(handleSuccess).toHaveBeenCalledWith({ foo: 'foo-value' });
    });

    it('passes initialValues into state', () => {
        jest.resetAllMocks();
        initialValues = { foo: 'baz' };
        testHook(() => {
            form = useForm({ handleSuccess, validate, initialValues });
        });

        expect(form.values).toEqual(initialValues);

    });
});
