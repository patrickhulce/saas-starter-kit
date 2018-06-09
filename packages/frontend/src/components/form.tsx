import Button from '@material-ui/core/Button/Button'
import * as React from 'react'

import {ErrorBar} from './error-bar/error-bar'
import {LoadingBar} from './loading-bar/loading-bar'

export interface IFormData {
  [key: string]: any
}

export interface IFormState {
  isLoading?: boolean
  errorMessage?: string
}

export interface ISubmitOptions {
  label?: string
  testId?: string
}

export class Form<TProps = {}, TState extends IFormState = IFormState> extends React.Component<
  TProps,
  TState
> {
  public constructor(props: TProps) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public renderLoadingUI(): JSX.Element[] {
    return [
      <LoadingBar key="loading" isLoading={this.state.isLoading} />,
      <ErrorBar key="error" message={this.state.errorMessage} />,
    ]
  }

  public renderSubmitUI(options: ISubmitOptions = {}): JSX.Element[] {
    return [
      <Button
        key="submit"
        variant="raised"
        color="primary"
        type="submit"
        data-testid={options.testId}
        disabled={!!this.state.isLoading}
      >
        {options.label || 'Submit'}
      </Button>,
    ]
  }

  public handleSubmit(evt: any): void {
    evt.preventDefault()

    const data: IFormData = {}
    for (const [prop, val] of new FormData(evt.target).entries()) {
      data[prop] = val
    }

    this._handleSubmit(data)
  }

  protected _handleSubmit(data: IFormData): void {
    throw new Error('Unimplemented')
  }
}
