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
  public testId: string | undefined = undefined
  public submitUIOptions: ISubmitOptions | undefined = undefined

  public constructor(props: TProps) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public renderLoadingUI(): JSX.Element {
    return (
      <React.Fragment>
        <LoadingBar isLoading={this.state.isLoading} />
        <ErrorBar message={this.state.errorMessage} />
      </React.Fragment>
    )
  }

  public renderInputUI(): JSX.Element {
    return <React.Fragment />
  }

  public renderSubmitUI(options?: ISubmitOptions): JSX.Element {
    options = options || this.submitUIOptions || {}

    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          type="submit"
          data-testid={options.testId}
          disabled={!!this.state.isLoading}
        >
          {options.label || 'Submit'}
        </Button>
      </React.Fragment>
    )
  }

  public render(): JSX.Element {
    return (
      <form data-testid={this.testId} onSubmit={this.handleSubmit}>
        {this.renderLoadingUI()}
        {this.renderInputUI()}
        {this.renderSubmitUI()}
      </form>
    )
  }

  public async handleSubmit(evt: React.FormEvent<any>): Promise<void> {
    evt.preventDefault()

    const data: IFormData = {}
    for (const [prop, val] of new FormData(evt.target as HTMLFormElement).entries()) {
      data[prop] = val
    }

    try {
      this.setState({isLoading: true})
      await this._handleSubmit(data)
    } catch (err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({isLoading: false})
    }
  }

  protected _handleSubmit(data: IFormData): void {
    throw new Error('Unimplemented')
  }
}
