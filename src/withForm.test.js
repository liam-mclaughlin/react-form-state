import React from 'react';
import { mount } from 'enzyme';
import withForm from './withForm';

describe('withForm', () => {
    let wrapper;
    const validate = jest.fn(() => ({}));

    beforeEach(() => {
        const Inner = () => <div />
        const Component = withForm(validate)(Inner);
        wrapper = mount(<Component initialValues={{}} />);
    })

    it('should provide handleChange, handleBlur, errors, values', () => {
        expect(typeof wrapper.childAt(0).props().handleChange).toBe('function');
        expect(typeof wrapper.childAt(0).props().handleBlur).toBe('function');
        expect(typeof wrapper.childAt(0).props().errors).toBe('object');
        expect(typeof wrapper.childAt(0).props().values).toBe('object');
        expect(typeof wrapper.childAt(0).props().touched).toBe('object');
    });

    it('sets the values state when changing an input value', () => {
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        wrapper.instance().handleChange(event);
        expect(wrapper.state().values.foo).toBe('foo-value');
    });

    it('sets the touched state when bluring from an input value', () => {
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };

        wrapper.instance().handleBlur(event);

        expect(wrapper.state().touched.foo).toBe(true);
    });

    it('sets the error state using the validation callback on blur', () => {
        const validateFtn = jest.fn(input => (
            Object.keys(input)
                .reduce((cum, cur) => {
                    const ret = { ...cum, [cur]: true };
                    return ret;
                }, {})));
        const Inner = () => <div />
        const Component = withForm(validateFtn)(Inner);
        wrapper = mount(<Component initialValues={{}} />);
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        wrapper.instance().handleBlur(event);
        expect(validateFtn).toHaveBeenCalledTimes(1);
        expect(wrapper.state().errors).toEqual({ foo: true });
    });

    it('sets the error state using the validation callback on change', () => {
        const validateFtn = jest.fn(input => (
            Object.keys(input)
                .reduce((cum, cur) => {
                    const ret = { ...cum, [cur]: true };
                    return ret;
                }, {})));
        const Inner = () => <div />
        const Component = withForm(validateFtn)(Inner);
        wrapper = mount(<Component initialValues={{}} />);
        const event = {
            persist: jest.fn(),
            target: {
                name: 'foo',
                value: 'foo-value',
            },
        };
        wrapper.instance().handleChange(event);
        expect(validateFtn).toHaveBeenCalledTimes(1);
        expect(wrapper.state().errors).toEqual({ foo: true });
    });

    it('passes initialValues into state', () => {
        const Inner = () => <div />
        const initialValues = { foo: 'baz' };
        const Component = withForm(validate)(Inner);
        wrapper = mount(<Component initialValues={initialValues} />);
        expect(wrapper.state().values).toEqual(initialValues);

    });

})