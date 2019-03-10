import { useState, useEffect } from 'react';

const useForm = ({ handleSuccess, validate, initialValues = {} }) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            handleSuccess(values);
        }
    }, [errors]);

    const handleChange = (event) => {
        event.persist();
        const newValues = { ...values, [event.target.name]: event.target.value };
        setValues(newValues);
        setErrors(validate(newValues));
    };

    const handleBlur = (event) => {
        event.persist();
        const newValues = { ...values, [event.target.name]: event.target.value };
        const newTouched = { ...touched, [event.target.name]: true };
        setValues(newValues);
        setTouched(newTouched);
        setErrors(validate(newValues));
    };

    return {
        handleChange,
        handleBlur,
        errors,
        values,
        touched,
    };
};

export default useForm;
