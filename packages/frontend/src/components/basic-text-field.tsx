import TextField from '@material-ui/core/TextField'
import {kebabCase, startCase} from 'lodash'
import * as React from 'react'

export interface IBasicTextFieldProps {
  name: string
  label?: string
  type?: string
  autoFocus?: boolean
  required?: boolean
  className?: string
}

export class BasicTextField extends React.Component<IBasicTextFieldProps> {
  public render(): JSX.Element {
    const textFieldProps = {
      id: `${kebabCase(this.props.name)}-input`,
      type: 'text',
      label: startCase(this.props.name),
      required: true,
    }

    return <TextField {...textFieldProps} {...this.props} />
  }
}
