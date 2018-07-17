import Button from '@material-ui/core/Button/Button'
import * as React from 'react'

import {testIds} from '../../utils'
import {LoadingBar} from '../loading-bar/loading-bar'
import {MessageBar, MessageBarStyle} from '../message-bar/message-bar'

export interface IFormData {
  [key: string]: any
}

export interface IFormState {
  isLoading?: boolean
  errorMessage?: string
  successMessage?: string
}

export interface ISubmitOptions {
  label?: string
  testId?: string
}

export interface IDefaultFormProps {
  className?: string
}

export class Form<TProps = {}, TState extends IFormState = IFormState> extends React.Component<
  TProps & IDefaultFormProps,
  TState
> {
  public testId: string | undefined = undefined
  public submitUIOptions: ISubmitOptions | undefined = undefined

  public constructor(props: TProps & IDefaultFormProps) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public renderLoadingUI(): JSX.Element {
    return (
      <React.Fragment>
        <LoadingBar isLoading={this.state.isLoading} />
        <MessageBar message={this.state.successMessage} style={MessageBarStyle.Success} />
        <MessageBar message={this.state.errorMessage} style={MessageBarStyle.Error} />
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
      <form
        data-testid={this.testId || testIds.defaultForm}
        onSubmit={this.handleSubmit}
        className={this.props.className}
      >
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

  protected async _handleSubmit(data: IFormData): Promise<void> {
    throw new Error('Unimplemented')
  }
}
