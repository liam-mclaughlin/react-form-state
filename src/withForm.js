import React from 'react';

const withForm = (validate) => (Component) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            const { initialValues } = this.props;
            this.state = {
                errors: {},
                values: initialValues || {},
                touched: {},
                dirty: false,
            }
            this.handleBlur = this.handleBlur.bind(this);
            this.handleChange = this.handleChange.bind(this);
        }

        handleChange(event) {
            event.persist();
            const { values } = this.state;
            const newValues = { ...values, [event.target.name]: event.target.value };
            this.setState({
                ...this.state,
                values: newValues,
                errors: validate(newValues),
                dirty: true,
            });
        }

        handleBlur(event) {
            event.persist();
            const { values, touched } = this.state;
            const newValues = { ...values, [event.target.name]: event.target.value };
            const newTouched = { ...touched, [event.target.name]: true };
            this.setState({
                ...this.state,
                values: newValues,
                errors: validate(newValues),
                touched: newTouched,
                dirty: true,
            });
        };

        render() {
            const {
                errors,
                values,
                touched,
                dirty,
            } = this.state;
            return (<Component
                errors={errors}
                values={values}
                touched={touched}
                dirty={dirty}
                handleBlur={this.handleBlur}
                handleChange={this.handleChange}
                {...this.props}
            />);
        }

    }
}

export default withForm;